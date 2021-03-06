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

package rollupvalidator

import (
	"context"
	"github.com/offchainlabs/arbitrum/packages/arb-validator-core/evm"
	"net/http"
	"time"

	"github.com/offchainlabs/arbitrum/packages/arb-validator/rollupmanager"
)

// Server provides an interface for interacting with a a running coordinator
type RPCServer struct {
	*Server
}

// NewServer returns a new instance of the Server class
func NewRPCServer(
	man *rollupmanager.Manager,
	maxCallTime time.Duration,
) (*RPCServer, error) {
	server, err := NewServer(man, maxCallTime)
	return &RPCServer{Server: server}, err
}

// FindLogs takes a set of parameters and return the list of all logs that match
// the query
func (m *RPCServer) FindLogs(
	_ *http.Request,
	args *evm.FindLogsArgs,
	reply *evm.FindLogsReply,
) error {
	ret, err := m.Server.FindLogs(context.Background(), args)
	if err != nil || ret == nil {
		return err
	}
	reply.Logs = ret.Logs
	return nil
}

func (m *RPCServer) GetOutputMessage(
	_ *http.Request,
	args *evm.GetOutputMessageArgs,
	reply *evm.GetOutputMessageReply,
) error {
	ret, err := m.Server.GetOutputMessage(context.Background(), args)
	if err != nil || ret == nil {
		return err
	}
	reply.Found = ret.Found
	reply.RawVal = ret.RawVal
	return nil
}

// GetMessageResult returns the value output by the VM in response to the
//message with the given hash
func (m *RPCServer) GetMessageResult(
	_ *http.Request,
	args *evm.GetMessageResultArgs,
	reply *evm.GetMessageResultReply,
) error {
	ret, err := m.Server.GetMessageResult(context.Background(), args)
	if err != nil || ret == nil {
		return err
	}
	reply.Tx = ret.Tx
	return nil
}

// GetAssertionCount returns the total number of finalized assertions
func (m *RPCServer) GetAssertionCount(
	_ *http.Request,
	args *evm.GetAssertionCountArgs,
	reply *evm.GetAssertionCountReply,
) error {
	ret, err := m.Server.GetAssertionCount(context.Background(), args)
	if err != nil || ret == nil {
		return err
	}
	reply.AssertionCount = ret.AssertionCount
	return nil
}

// GetVMInfo returns current metadata about this VM
func (m *RPCServer) GetVMInfo(
	_ *http.Request,
	args *evm.GetVMInfoArgs,
	reply *evm.GetVMInfoReply,
) error {
	ret, err := m.Server.GetVMInfo(context.Background(), args)
	if err != nil || ret == nil {
		return err
	}
	reply.VmID = ret.VmID
	return nil
}

// CallMessage takes a request from a client to process in a temporary context
// and return the result
func (m *RPCServer) CallMessage(
	_ *http.Request,
	args *evm.CallMessageArgs,
	reply *evm.CallMessageReply,
) error {
	ret, err := m.Server.CallMessage(context.Background(), args)
	if err != nil || ret == nil {
		return err
	}
	reply.RawVal = ret.RawVal
	return nil
}

// PendingCall takes a request from a client to process in a temporary context
// and return the result
func (m *RPCServer) PendingCall(
	_ *http.Request,
	args *evm.CallMessageArgs,
	reply *evm.CallMessageReply,
) error {
	ret, err := m.Server.PendingCall(context.Background(), args)
	if err != nil || ret == nil {
		return err
	}
	reply.RawVal = ret.RawVal
	return nil
}

func (m *RPCServer) GetLatestNodeLocation(
	_ *http.Request,
	args *evm.GetLatestNodeLocationArgs,
	reply *evm.GetLatestNodeLocationReply,
) error {
	ret, err := m.Server.GetLatestNodeLocation(context.Background(), args)
	if err != nil || ret == nil {
		return err
	}
	reply.Location = ret.Location
	return nil
}

func (m *RPCServer) GetLatestPendingNodeLocation(
	_ *http.Request,
	args *evm.GetLatestNodeLocationArgs,
	reply *evm.GetLatestNodeLocationReply,
) error {
	ret, err := m.Server.GetLatestPendingNodeLocation(context.Background(), args)
	if err != nil || ret == nil {
		return err
	}
	reply.Location = ret.Location
	return nil
}
