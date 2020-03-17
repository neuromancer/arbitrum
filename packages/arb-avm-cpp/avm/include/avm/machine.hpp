/*
 * Copyright 2019, Offchain Labs, Inc.
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

#ifndef machine_hpp
#define machine_hpp

#include <avm/machinestate/machinestate.hpp>
#include <avm/value/value.hpp>

#include <memory>
#include <unordered_set>
#include <vector>

struct StartTrackingData {
    value register_val;
    std::vector<value> stack;
    std::vector<value> auxstack;
};

struct EndTrackingData {
    std::unordered_set<uint256_t> stack_seen_value_hashes;
    std::unordered_set<uint256_t> auxstack_seen_value_hashes;
    size_t stack_min_height;
    size_t auxstack_min_height;

    std::vector<unsigned char> accessedValues(
        const StartTrackingData& start_data) {
        auto seen_value_hashes = std::move(stack_seen_value_hashes);

        seen_value_hashes.insert(
            make_move_iterator(auxstack_seen_value_hashes.begin()),
            make_move_iterator(auxstack_seen_value_hashes.end()));

        std::vector<value> stack_items;
        std::vector<value> auxstack_items;
        auto stack_item_count = start_data.stack.size() - stack_min_height;

        stack_items.insert(
            stack_items.end(),
            make_move_iterator(start_data.stack.end() - stack_item_count),
            make_move_iterator(start_data.stack.end()));

        auto auxstack_item_count =
            start_data.auxstack.size() - auxstack_min_height;
        auxstack_items.insert(
            auxstack_items.end(),
            make_move_iterator(start_data.auxstack.end() - auxstack_item_count),
            make_move_iterator(start_data.auxstack.end()));
        std::vector<unsigned char> n_step_data;
        marshal_n_step(start_data.register_val, seen_value_hashes, n_step_data);
        for (const auto& val : stack_items) {
            marshal_value(val, n_step_data);
        }
        for (const auto& val : auxstack_items) {
            marshal_value(val, n_step_data);
        }

        return n_step_data;
    }
};

struct Assertion {
    uint64_t stepCount;
    std::vector<value> outMessages;
    std::vector<value> logs;
};

class Machine {
    MachineState machine_state;

    friend std::ostream& operator<<(std::ostream&, const Machine&);
    void runOne();

   public:
    bool initializeMachine(const std::string& filename);
    bool deserialize(char* data) { return machine_state.deserialize(data); }

    Assertion run(uint64_t stepCount,
                  uint64_t timeBoundStart,
                  uint64_t timeBoundEnd);

    Status currentStatus() { return machine_state.state; }
    BlockReason lastBlockReason() { return machine_state.blockReason; }
    uint256_t hash() const { return machine_state.hash(); }
    std::vector<unsigned char> marshalForProof() {
        return machine_state.marshalForProof();
    }
    uint64_t pendingMessageCount() const {
        return machine_state.pendingMessageCount();
    }

    uint256_t inboxHash() const { return ::hash(machine_state.inbox.messages); }

    void sendOnchainMessage(const Message& msg);
    void deliverOnchainMessages();
    void sendOffchainMessages(const std::vector<Message>& messages);

    TuplePool& getPool() { return *machine_state.pool; }

    SaveResults checkpoint(CheckpointStorage& storage);
    bool restoreCheckpoint(const CheckpointStorage& storage,
                           const std::vector<unsigned char>& checkpoint_key);
    DeleteResults deleteCheckpoint(CheckpointStorage& storage);

    StartTrackingData startTracking() {
        machine_state.stack.resetMinHeight();
        machine_state.auxstack.resetMinHeight();
        return {machine_state.registerVal, machine_state.stack.values,
                machine_state.auxstack.values};
    }

    EndTrackingData finishTracking() {
        auto seen_stack = std::move(machine_state.stack.seen_value_hashes);
        auto seen_auxstack =
            std::move(machine_state.auxstack.seen_value_hashes);

        machine_state.stack.seen_value_hashes.clear();
        machine_state.auxstack.seen_value_hashes.clear();
        return {
            seen_stack,
            seen_auxstack,
            machine_state.stack.min_height,
            machine_state.auxstack.min_height,
        };
    }
};

std::ostream& operator<<(std::ostream& os, const MachineState& val);
std::ostream& operator<<(std::ostream& os, const Machine& val);

#endif /* machine_hpp */
