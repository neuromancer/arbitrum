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

package gobridge

import (
	"context"
	"errors"
	"fmt"
	"github.com/offchainlabs/arbitrum/packages/arb-util/hashing"
	"github.com/offchainlabs/arbitrum/packages/arb-util/value"
	"github.com/offchainlabs/arbitrum/packages/arb-validator/arbbridge"
	"github.com/offchainlabs/arbitrum/packages/arb-validator/structures"
	"math/big"

	"github.com/offchainlabs/arbitrum/packages/arb-util/common"
	"github.com/offchainlabs/arbitrum/packages/arb-validator/valprotocol"
)

type ExecutionChallenge struct {
	*bisectionChallenge
}

func NewExecutionChallenge(address common.Address, client *GoArbAuthClient) (*ExecutionChallenge, error) {
	fmt.Println("in NewExecutionChallenge")
	bisectionChallenge, err := newBisectionChallenge(address, client)
	if err != nil {
		return nil, err
	}
	// create new execution challenge contract
	//executionContract, err := executionchallenge.NewExecutionChallenge(address, client)
	//if err != nil {
	//	return nil, errors2.Wrap(err, "Failed to connect to ChallengeManager")
	//}
	vm := &ExecutionChallenge{bisectionChallenge: bisectionChallenge}
	//err = vm.setupContracts()
	return vm, err
}

func (c *ExecutionChallenge) BisectAssertion(
	ctx context.Context,
	precondition *valprotocol.Precondition,
	assertions []*valprotocol.ExecutionAssertionStub,
	totalSteps uint64,
) error {
	fmt.Println("in ExecutionChallenge BisectAssertion")
	machineHashes := make([][32]byte, 0, len(assertions)+1)
	didInboxInsns := make([]bool, 0, len(assertions))
	messageAccs := make([][32]byte, 0, len(assertions)+1)
	logAccs := make([][32]byte, 0, len(assertions)+1)
	gasses := make([]uint64, 0, len(assertions))
	machineHashes = append(machineHashes, precondition.BeforeHash)
	messageAccs = append(messageAccs, assertions[0].FirstMessageHash)
	logAccs = append(logAccs, assertions[0].FirstLogHash)

	totalGas := big.NewInt(0)
	everDidInboxInsn := false
	for _, assertion := range assertions {
		totalGas.Add(totalGas, big.NewInt(int64(assertion.NumGas)))
		everDidInboxInsn = everDidInboxInsn || assertion.DidInboxInsn

		machineHashes = append(machineHashes, assertion.AfterHash)
		didInboxInsns = append(didInboxInsns, assertion.DidInboxInsn)
		messageAccs = append(messageAccs, assertion.LastMessageHash)
		logAccs = append(logAccs, assertion.LastLogHash)
		gasses = append(gasses, assertion.NumGas)
	}

	//uint256 bisectionCount = _data.machineHashes.length - 1;
	bisectionCount := len(machineHashes) - 1
	//
	preconditionHash := structures.ExecutionPreconditionHash(machineHashes[0], precondition.TimeBounds, precondition.BeforeInbox.Hash())
	//	return keccak256(
	//		abi.encodePacked(
	//			_afterHash,
	//			_didInboxInsn,
	//			_numGas,
	//			_firstMessageHash,
	//			_lastMessageHash,
	//			_firstLogHash,
	//			_lastLogHash
	//	)
	//);

	assertionHash := generateAssertionHash(
		machineHashes[bisectionCount],
		everDidInboxInsn,
		totalGas,
		messageAccs[0],
		messageAccs[bisectionCount],
		logAccs[0],
		logAccs[bisectionCount],
	)

	//requireMatchesPrevState(
	//	ChallengeUtils.executionHash(_data.totalSteps, preconditionHash, assertionHash)
	//);
	if !c.client.GoEthClient.challenges[c.contractAddress].challengerDataHash.Equals(structures.ExecutionDataHash(totalSteps, preconditionHash, assertionHash)) {
		return errors.New("Incorrect previous state")
	}
	//
	//bytes32[] memory hashes = new bytes32[](bisectionCount);
	//assertionHash = Protocol.generateAssertionHash(
	//	_data.machineHashes[1],
	//	_data.didInboxInsns[0],
	//	_data.gases[0],
	//	_data.messageAccs[0],
	//	_data.messageAccs[1],
	//	_data.logAccs[0],
	//	_data.logAccs[1]
	//);
	assertionHash = generateAssertionHash(
		machineHashes[1],
		didInboxInsns[0],
		big.NewInt(int64(gasses[0])),
		messageAccs[0],
		messageAccs[1],
		logAccs[0],
		logAccs[1],
	)

	//hashes[0] = ChallengeUtils.executionHash(
	//	uint32(firstSegmentSize(uint(_data.totalSteps), bisectionCount)),
	//	Protocol.generatePreconditionHash(
	//		_data.machineHashes[0],
	//		_data.timeBoundsBlocks,
	//		_data.beforeInbox
	//),
	//assertionHash
	//);

	var hashes [][32]byte
	hashes[0] = structures.ExecutionDataHash(
		totalSteps/uint64(bisectionCount)+totalSteps%uint64(bisectionCount),
		preconditionHash,
		assertionHash,
	)
	//
	//for (uint256 i = 1; i < bisectionCount; i++) {
	//	if (_data.didInboxInsns[i-1]) {
	//		_data.beforeInbox = Value.hashEmptyTuple();
	//	}
	//	assertionHash = Protocol.generateAssertionHash(
	//		_data.machineHashes[i + 1],
	//		_data.didInboxInsns[i],
	//		_data.gases[i],
	//		_data.messageAccs[i],
	//		_data.messageAccs[i + 1],
	//		_data.logAccs[i],
	//		_data.logAccs[i + 1]
	//	);
	//	hashes[i] = ChallengeUtils.executionHash(
	//		uint32(otherSegmentSize(uint(_data.totalSteps), bisectionCount)),
	//		Protocol.generatePreconditionHash(
	//			_data.machineHashes[i],
	//			_data.timeBoundsBlocks,
	//			_data.beforeInbox
	//	),
	//	assertionHash
	//	);
	//}
	for i := 1; i < bisectionCount; i++ {
		if didInboxInsns[i-1] {
			precondition.BeforeInbox = value.NewEmptyTuple()
		}
		assertionHash = generateAssertionHash(
			machineHashes[i+1],
			didInboxInsns[i],
			big.NewInt(int64(gasses[i])),
			messageAccs[i],
			messageAccs[i+1],
			logAccs[i],
			logAccs[i+1],
		)
		hashes[i] = structures.ExecutionDataHash(
			totalSteps/uint64(bisectionCount),
			structures.ExecutionPreconditionHash(machineHashes[i], precondition.TimeBounds, precondition.BeforeInbox.Hash()),
			assertionHash)
	}
	//
	//commitToSegment(hashes);
	commitToSegment(c.client.GoEthClient.challenges[c.contractAddress], hashes)
	//asserterResponded();
	//asserterResponded(c.client)

	//
	//emit BisectedAssertion(
	//	_data.machineHashes,
	//	_data.didInboxInsns,
	//	_data.messageAccs,
	//	_data.logAccs,
	//	_data.gases,
	//	_data.totalSteps,
	//	deadlineTicks
	//);

	c.client.GoEthClient.pubMsg(arbbridge.MaybeEvent{
		Event: arbbridge.ExecutionBisectionEvent{
			ChainInfo: arbbridge.ChainInfo{
				BlockId: c.client.GoEthClient.getCurrentBlock(),
			},
			Assertions: assertions,
			TotalSteps: totalSteps,
			Deadline:   c.client.GoEthClient.challenges[c.contractAddress].deadline,
		},
	})

	return nil
}
func hashSliceToHashes(slice [][32]byte) []common.Hash {
	ret := make([]common.Hash, 0, len(slice))
	for _, a := range slice {
		ret = append(ret, a)
	}
	return ret
}

func (c *ExecutionChallenge) OneStepProof(
	ctx context.Context,
	precondition *valprotocol.Precondition,
	assertion *valprotocol.ExecutionAssertionStub,
	proof []byte,
) error {
	fmt.Println("in ExecutionChallenge OneStepProof")
	//c.auth.Context = ctx
	//tx, err := c.challenge.OneStepProof(
	//	c.auth,
	//	precondition.BeforeHash,
	//	precondition.BeforeInbox.Hash(),
	//	precondition.TimeBounds.AsIntArray(),
	//	assertion.AfterHashValue(),
	//	assertion.DidInboxInsn,
	//	assertion.FirstMessageHashValue(),
	//	assertion.LastMessageHashValue(),
	//	assertion.FirstLogHashValue(),
	//	assertion.LastLogHashValue(),
	//	assertion.NumGas,
	//	proof,
	//)
	//if err != nil {
	//	return err
	//}
	//return c.waitForReceipt(ctx, tx, "OneStepProof")
	//return nil

	//	bytes32 precondition = Protocol.generatePreconditionHash(
	//		_beforeHash,
	//		_timeBoundsBlocks,
	//		_beforeInbox
	//	);

	structures.ExecutionPreconditionHash(precondition.BeforeHash, precondition.TimeBounds, precondition.BeforeInbox.Hash())
	precondition.Hash()
	//	requireMatchesPrevState(
	//		ChallengeUtils.executionHash(
	//			1,
	//			precondition,
	//			Protocol.generateAssertionHash(
	//				_afterHash,
	//				_didInboxInsns,
	//				_gas,
	//				_firstMessage,
	//				_lastMessage,
	//				_firstLog,
	//				_lastLog
	//	)
	//)
	//);

	matchHash := structures.ExecutionDataHash(1, precondition.Hash(), assertion.Hash())
	if !c.client.GoEthClient.challenges[c.contractAddress].challengerDataHash.Equals(matchHash) {
		return errors.New("Incorrect previous state")
	}
	//
	//	uint256 correctProof = OneStepProof.validateProof(
	//		_beforeHash,
	//		_timeBoundsBlocks,
	//		_beforeInbox,
	//		_afterHash,
	//		_didInboxInsns,
	//		_firstMessage,
	//		_lastMessage,
	//		_firstLog,
	//		_lastLog,
	//		_gas,
	//		_proof
	//	);
	//
	// for now make OSP always valid

	//	require(correctProof == 0, OSP_PROOF);
	//	emit OneStepProofCompleted();
	c.client.GoEthClient.pubMsg(arbbridge.MaybeEvent{
		Event: arbbridge.ChallengeCompletedEvent{
			ChainInfo: arbbridge.ChainInfo{
				BlockId: c.client.GoEthClient.getCurrentBlock(),
			},
			Winner:            c.client.GoEthClient.challenges[c.contractAddress].asserter,
			Loser:             c.client.GoEthClient.challenges[c.contractAddress].challenger,
			ChallengeContract: c.contractAddress,
		},
	})

	//	_asserterWin();

	return nil
}

func (c *ExecutionChallenge) ChooseSegment(
	ctx context.Context,
	assertionToChallenge uint16,
	preconditions []*valprotocol.Precondition,
	assertions []*valprotocol.ExecutionAssertionStub,
	totalSteps uint64,
) error {
	fmt.Println("in ExecutionChallenge ChooseSegment")
	bisectionHashes := make([]common.Hash, 0, len(assertions))
	for i := range assertions {
		stepCount := structures.CalculateBisectionStepCount(uint64(i), uint64(len(assertions)), totalSteps)
		bisectionHashes = append(
			bisectionHashes,
			structures.ExecutionDataHash(stepCount, preconditions[i].Hash(), assertions[i].Hash()),
		)
	}
	return c.bisectionChallenge.chooseSegment(
		ctx,
		assertionToChallenge,
		bisectionHashes,
	)
}

func generateAssertionHash(
	machineHash [32]byte,
	everDidInboxInsn bool,
	numGas *big.Int,
	firstMsgHash [32]byte,
	lastMsgHash [32]byte,
	firstLogHash [32]byte,
	lastLogHash [32]byte,
) common.Hash {
	return hashing.SoliditySHA3(
		hashing.Bytes32(machineHash),
		hashing.Bool(everDidInboxInsn),
		hashing.Uint256(numGas),
		hashing.Bytes32(firstMsgHash),
		hashing.Bytes32(lastMsgHash),
		hashing.Bytes32(firstLogHash),
		hashing.Bytes32(lastLogHash),
	)
}