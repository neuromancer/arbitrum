/*
 * Copyright 2020, Offchain Labs, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package ethbridge

import (
	"context"
	"math/big"
	"strings"

	"github.com/offchainlabs/arbitrum/packages/arb-validator/ethbridge/pendingtopchallenge"

	"github.com/offchainlabs/arbitrum/packages/arb-validator/ethbridge/messageschallenge"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	errors2 "github.com/pkg/errors"
)

var pendingTopBisectedID common.Hash
var pendingTopOneStepProofCompletedID common.Hash

func init() {
	parsed, err := abi.JSON(strings.NewReader(messageschallenge.MessagesChallengeABI))
	if err != nil {
		panic(err)
	}
	pendingTopBisectedID = parsed.Events["Bisected"].ID()
	pendingTopOneStepProofCompletedID = parsed.Events["OneStepProofCompleted"].ID()
}

type PendingTopChallenge struct {
	*BisectionChallenge
	Challenge *pendingtopchallenge.PendingTopChallenge
}

func NewPendingTopChallenge(address common.Address, client *ethclient.Client) (*PendingTopChallenge, error) {
	bisectionChallenge, err := NewBisectionChallenge(address, client)
	if err != nil {
		return nil, err
	}
	vm := &PendingTopChallenge{BisectionChallenge: bisectionChallenge}
	err = vm.setupContracts()
	return vm, err
}

func (c *PendingTopChallenge) setupContracts() error {
	challengeManagerContract, err := pendingtopchallenge.NewPendingTopChallenge(c.address, c.Client)
	if err != nil {
		return errors2.Wrap(err, "Failed to connect to MessagesChallenge")
	}

	c.Challenge = challengeManagerContract
	return nil
}

func (c *PendingTopChallenge) StartConnection(ctx context.Context, outChan chan Notification, errChan chan error) error {
	if err := c.BisectionChallenge.StartConnection(ctx, outChan, errChan); err != nil {
		return err
	}
	if err := c.setupContracts(); err != nil {
		return err
	}
	header, err := c.Client.HeaderByNumber(ctx, nil)
	if err != nil {
		return err
	}

	filter := ethereum.FilterQuery{
		Addresses: []common.Address{c.address},
		Topics: [][]common.Hash{{
			pendingTopBisectedID,
			pendingTopOneStepProofCompletedID,
		}},
	}

	logs, err := c.Client.FilterLogs(ctx, filter)
	if err != nil {
		return err
	}
	for _, log := range logs {
		if err := c.processEvents(ctx, log, outChan); err != nil {
			return err
		}
	}

	filter.FromBlock = header.Number
	logChan := make(chan types.Log)
	logSub, err := c.Client.SubscribeFilterLogs(ctx, filter, logChan)
	if err != nil {
		return err
	}

	go func() {
		defer logSub.Unsubscribe()

		for {
			select {
			case <-ctx.Done():
				break
			case log := <-logChan:
				if err := c.processEvents(ctx, log, outChan); err != nil {
					errChan <- err
					return
				}
			case err := <-logSub.Err():
				errChan <- err
				return
			}
		}
	}()
	return nil
}

func (c *PendingTopChallenge) processEvents(ctx context.Context, log types.Log, outChan chan Notification) error {
	event, err := func() (Event, error) {
		if log.Topics[0] == pendingTopBisectedID {
			eventVal, err := c.Challenge.ParseBisected(log)
			if err != nil {
				return nil, err
			}
			return PendingTopBisectionEvent{
				ChainHashes:   eventVal.ChainHashes,
				TotalLength:   eventVal.TotalLength,
				DeadlineTicks: eventVal.DeadlineTicks,
			}, nil
		} else if log.Topics[0] == pendingTopOneStepProofCompletedID {
			_, err := c.Challenge.ParseOneStepProofCompleted(log)
			if err != nil {
				return nil, err
			}
			return OneStepProofEvent{}, nil
		}
		return nil, errors2.New("unknown arbitrum event type")
	}()

	if err != nil {
		return err
	}

	header, err := c.Client.HeaderByHash(ctx, log.BlockHash)
	if err != nil {
		return err
	}
	outChan <- Notification{
		Header: header,
		VMID:   c.address,
		Event:  event,
		TxHash: log.TxHash,
	}
	return nil
}

func (c *PendingTopChallenge) Bisect(
	auth *bind.TransactOpts,
	chainHashes [][32]byte,
	chainLength *big.Int,
) (*types.Receipt, error) {

	tx, err := c.Challenge.Bisect(
		auth,
		chainHashes,
		chainLength,
	)
	if err != nil {
		return nil, err
	}
	return waitForReceipt(auth.Context, c.Client, auth, tx, "Bisect")
}

func (c *PendingTopChallenge) OneStepProof(
	auth *bind.TransactOpts,
	lowerHashA [32]byte,
	topHashA [32]byte,
	value [32]byte,
) (*types.Receipt, error) {
	tx, err := c.Challenge.OneStepProof(
		auth,
		lowerHashA,
		topHashA,
		value,
	)
	if err != nil {
		return nil, err
	}
	return waitForReceipt(auth.Context, c.Client, auth, tx, "OneStepProof")
}