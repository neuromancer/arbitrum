/*
 * Copyright 2019-2020, Offchain Labs, Inc.
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

	"github.com/offchainlabs/arbitrum/packages/arb-validator-core/ethutils"
	"github.com/offchainlabs/arbitrum/packages/arb-validator-core/message"
	"math/big"

	errors2 "github.com/pkg/errors"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	ethcommon "github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/offchainlabs/arbitrum/packages/arb-util/common"
)

type globalInbox struct {
	*globalInboxWatcher
	auth *TransactAuth
}

func newGlobalInbox(address ethcommon.Address, chain ethcommon.Address, client ethutils.EthClient, auth *TransactAuth) (*globalInbox, error) {
	watcher, err := newGlobalInboxWatcher(address, chain, client)
	if err != nil {
		return nil, errors2.Wrap(err, "Failed to connect to GlobalInbox")
	}
	return &globalInbox{watcher, auth}, nil
}

func (con *globalInbox) SendL2Message(ctx context.Context, chain common.Address, msg message.L2Message) error {
	con.auth.Lock()
	defer con.auth.Unlock()
	tx, err := con.GlobalInbox.SendL2MessageFromOrigin(
		con.auth.getAuth(ctx),
		chain.ToEthAddress(),
		msg.AsData(),
	)
	if err != nil {
		return err
	}
	return con.waitForReceipt(ctx, tx, "SendL2MessageFromOrigin")
}

func (con *globalInbox) SendL2MessageNoWait(ctx context.Context, chain common.Address, msg message.L2Message) error {
	con.auth.Lock()
	defer con.auth.Unlock()
	_, err := con.GlobalInbox.SendL2MessageFromOrigin(
		con.auth.getAuth(ctx),
		chain.ToEthAddress(),
		msg.AsData(),
	)
	if err != nil {
		return err
	}
	return err
}

func (con *globalInbox) DepositEthMessage(
	ctx context.Context,
	chain common.Address,
	destination common.Address,
	value *big.Int,
) error {

	tx, err := con.GlobalInbox.DepositEthMessage(
		&bind.TransactOpts{
			From:     con.auth.auth.From,
			Signer:   con.auth.auth.Signer,
			GasLimit: con.auth.auth.GasLimit,
			Value:    value,
			Context:  ctx,
		},
		chain.ToEthAddress(),
		destination.ToEthAddress(),
	)

	if err != nil {
		return err
	}

	return con.waitForReceipt(ctx, tx, "DepositEthMessage")
}

func (con *globalInbox) DepositERC20Message(
	ctx context.Context,
	chain common.Address,
	tokenAddress common.Address,
	destination common.Address,
	value *big.Int,
) error {
	con.auth.Lock()
	defer con.auth.Unlock()
	tx, err := con.GlobalInbox.DepositERC20Message(
		con.auth.getAuth(ctx),
		chain.ToEthAddress(),
		tokenAddress.ToEthAddress(),
		destination.ToEthAddress(),
		value,
	)

	if err != nil {
		return err
	}

	return con.waitForReceipt(ctx, tx, "DepositERC20Message")
}

func (con *globalInbox) DepositERC721Message(
	ctx context.Context,
	chain common.Address,
	tokenAddress common.Address,
	destination common.Address,
	value *big.Int,
) error {
	con.auth.Lock()
	defer con.auth.Unlock()
	tx, err := con.GlobalInbox.DepositERC721Message(
		con.auth.getAuth(ctx),
		chain.ToEthAddress(),
		tokenAddress.ToEthAddress(),
		destination.ToEthAddress(),
		value,
	)

	if err != nil {
		return err
	}

	return con.waitForReceipt(ctx, tx, "DepositERC721Message")
}

func (con *globalInbox) waitForReceipt(ctx context.Context, tx *types.Transaction, methodName string) error {
	return waitForReceipt(ctx, con.client, con.auth.auth.From, tx, methodName)
}
