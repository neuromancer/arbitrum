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

package rollupvalidator

import (
	"context"
	"github.com/offchainlabs/arbitrum/packages/arb-avm-cpp/cmachine"
	"github.com/offchainlabs/arbitrum/packages/arb-validator-core/arbbridge"
	"log"
	"os"
	"testing"

	"github.com/offchainlabs/arbitrum/packages/arb-util/common"
	"github.com/offchainlabs/arbitrum/packages/arb-validator/structures"
)

func TestTxTracker(t *testing.T) {
	checkpointer, err := cmachine.NewCheckpoint(dbPath)
	if err != nil {
		t.Fatal(err)
	}
	if err := checkpointer.Initialize(contractPath); err != nil {
		t.Fatal(err)
	}

	nodes, err := setupNodes()
	if err != nil {
		t.Fatal(err)
	}

	info, err := processNode(nodes[1])
	if err != nil {
		t.Fatal(err)
	}

	logs := info.fullLogs()
	ns := checkpointer.GetConfirmedNodeStore()
	txTracker, err := newTxTracker(checkpointer, ns)
	if err != nil {
		t.Fatal(err)
	}

	countTest := func(node *structures.Node) func(*testing.T) {
		return func(t *testing.T) {
			count, err := txTracker.AssertionCount(context.Background())
			if err != nil {
				t.Fatal(err)
			}
			if count != node.Depth() {
				t.Error("wrong assertion count")
			}
		}
	}

	nodeTxInfo := func(node *structures.Node) func(*testing.T) {
		nodeInfo, err := processNode(node)
		if err != nil {
			t.Fatal(err)
		}
		return func(t *testing.T) {
			for i, txHash := range nodeInfo.EVMTransactionHashes {
				info, err := txTracker.TxInfo(context.Background(), txHash)
				if err != nil {
					t.Fatal(err)
				}
				if info == nil {
					t.Fatal("tx not found")
				}
				if !info.Equals(nodeInfo.getTxInfo(uint64(i))) {
					t.Error("Got wrong tx info")
				}
			}
		}
	}

	nodeTxInfoMissing := func(node *structures.Node) func(*testing.T) {
		nodeInfo, err := processNode(node)
		if err != nil {
			t.Fatal(err)
		}
		return func(t *testing.T) {
			for _, txHash := range nodeInfo.EVMTransactionHashes {
				info, err := txTracker.TxInfo(context.Background(), txHash)
				if err != nil {
					t.Fatal(err)
				}
				if info != nil {
					t.Fatal("tx was found, but shouldn't have been")
				}
			}
		}
	}

	findLogTest := func(fromHeight *uint64, toHeight *uint64) func(*testing.T) {
		return func(t *testing.T) {
			foundLogs, err := txTracker.FindLogs(context.Background(), nil, nil, []common.Address{logs[0].Address}, [][]common.Hash{{}})
			if err != nil {
				t.Fatal(err)
			}
			if len(foundLogs) != 1 {
				t.Fatal("wrong log count", len(foundLogs))
			}
			if !foundLogs[0].Equals(logs[0]) {
				t.Fatal("found wrong log")
			}
		}
	}

	findLogMissingTest := func(fromHeight *uint64, toHeight *uint64) func(*testing.T) {
		return func(t *testing.T) {
			foundLogs, err := txTracker.FindLogs(context.Background(), fromHeight, toHeight, []common.Address{logs[0].Address}, nil)
			if err != nil {
				t.Fatal(err)
			}
			if len(foundLogs) != 0 {
				t.Fatal("shouldn't have found log")
			}
		}
	}

	t.Run("UnknownTxInfo", func(t *testing.T) {
		info, err := txTracker.TxInfo(context.Background(), common.Hash{})
		if err != nil {
			t.Fatal(err)
		}
		if info != nil {
			t.Error("found non-existant tx")
		}
	})

	t.Run("FindLogsBeforeAdvancing", findLogMissingTest(nil, nil))
	for _, node := range nodes {
		t.Run("AdvancedKnownNode", func(t *testing.T) {
			txTracker.AdvancedKnownNode(context.Background(), nil, node)
		})
		t.Run("AssertionCount", countTest(node))
		t.Run("TxInfo", nodeTxInfo(node))
	}

	height1 := uint64(1)
	height2 := uint64(2)

	t.Run("FindLogs", func(t *testing.T) {
		findLogTest(nil, nil)(t)
		findLogTest(&height1, nil)(t)
		findLogTest(&height1, &height2)(t)
		findLogTest(nil, &height2)(t)
		findLogMissingTest(nil, &height1)
	})

	txTracker.ConfirmedNode(context.Background(), arbbridge.ConfirmedEvent{
		ChainInfo: arbbridge.ChainInfo{},
		NodeHash:  nodes[0].Hash(),
	})

	txTracker.RestartingFromLatestValid(context.Background(), nodes[0])

	t.Run("AssertionCountAfterReorg", countTest(nodes[0]))
	t.Run("FindLogsAfterReorg", findLogMissingTest(nil, nil))
	t.Run("TxInfoAfterReorg", nodeTxInfoMissing(nodes[1]))

	checkpointer.CloseCheckpointStorage()
	if err := os.RemoveAll(dbPath); err != nil {
		log.Fatal(err)
	}
}
