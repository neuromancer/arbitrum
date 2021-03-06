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

package chainlistener

import (
	"fmt"
	"github.com/offchainlabs/arbitrum/packages/arb-util/common"
	"github.com/offchainlabs/arbitrum/packages/arb-util/machine"
	"github.com/offchainlabs/arbitrum/packages/arb-util/protocol"
	"github.com/offchainlabs/arbitrum/packages/arb-validator-core/valprotocol"
	"github.com/offchainlabs/arbitrum/packages/arb-validator/structures"
	"math/big"
	"time"
)

type PreparedAssertion struct {
	Prev        *structures.Node
	BeforeState *valprotocol.VMProtoData
	Params      *valprotocol.AssertionParams
	Claim       *valprotocol.AssertionClaim
	Assertion   *protocol.ExecutionAssertion
	Machine     machine.Machine
	ValidBlock  *common.BlockId
}

func (pa *PreparedAssertion) String() string {
	return fmt.Sprintf(
		"PreparedAssertion(%v, %v, %v, %v, %v, %v)",
		pa.Prev.Hash(),
		pa.BeforeState,
		pa.Params,
		pa.Claim,
		pa.Assertion,
		pa.ValidBlock,
	)
}

func (pa *PreparedAssertion) Clone() *PreparedAssertion {
	return &PreparedAssertion{
		Prev:        pa.Prev,
		BeforeState: pa.BeforeState.Clone(),
		Params:      pa.Params.Clone(),
		Claim:       pa.Claim.Clone(),
		Assertion:   pa.Assertion,
		Machine:     pa.Machine,
		ValidBlock:  pa.ValidBlock.Clone(),
	}
}

func (pa *PreparedAssertion) PossibleFutureNode(chainParams valprotocol.ChainParams) *structures.Node {
	node := structures.NewValidNodeFromPrev(
		pa.Prev,
		valprotocol.NewDisputableNode(
			pa.Params,
			pa.Claim,
			common.Hash{},
			big.NewInt(0),
		),
		chainParams,
		common.BlocksFromSeconds(time.Now().Unix()),
		common.Hash{},
	)
	_ = node.UpdateValidOpinion(pa.Machine, pa.Assertion)
	return node
}

func (prep *PreparedAssertion) GetAssertionParams() [9][32]byte {
	return [9][32]byte{
		prep.BeforeState.MachineHash,
		prep.BeforeState.InboxTop,
		prep.Prev.PrevHash(),
		prep.Prev.NodeDataHash(),
		prep.Claim.AfterInboxTop,
		prep.Claim.ImportedMessagesSlice,
		prep.Claim.AssertionStub.AfterHash,
		prep.Claim.AssertionStub.LastMessageHash,
		prep.Claim.AssertionStub.LastLogHash,
	}
}
