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

#ifndef checkpoint_machine_hpp
#define checkpoint_machine_hpp

#include <avm/machinestate/status.hpp>

#include <avm_values/bigint.hpp>
#include <avm_values/codepointstub.hpp>

class Transaction;

template <typename T>
struct DbResult;

struct SaveResults;
struct DeleteResults;

class Machine;

struct MachineStateKeys {
    uint256_t static_hash;
    uint256_t register_hash;
    uint256_t datastack_hash;
    uint256_t auxstack_hash;
    uint256_t arb_gas_remaining;
    CodePointRef pc;
    CodePointStub err_pc;
    Status status;

    MachineStateKeys() : pc(0, 0), err_pc({0, 0}, 0) {}
    MachineStateKeys(uint256_t static_hash_,
                     uint256_t register_hash_,
                     uint256_t datastack_hash_,
                     uint256_t auxstack_hash_,
                     uint256_t arb_gas_remaining_,
                     CodePointRef pc_,
                     CodePointStub err_pc_,
                     Status status_)
        : static_hash(static_hash_),
          register_hash(register_hash_),
          datastack_hash(datastack_hash_),
          auxstack_hash(auxstack_hash_),
          arb_gas_remaining(arb_gas_remaining_),
          pc(pc_),
          err_pc(err_pc_),
          status(status_) {}
};

DbResult<MachineStateKeys> getMachineState(const Transaction& transaction,
                                           uint256_t machineHash);
SaveResults saveMachine(Transaction& transaction, const Machine& machine);
DeleteResults deleteMachine(Transaction& transaction, uint256_t machine_hash);

#endif /* checkpoint_machine_hpp */
