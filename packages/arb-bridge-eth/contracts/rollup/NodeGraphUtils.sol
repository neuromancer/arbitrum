// SPDX-License-Identifier: Apache-2.0

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

pragma solidity ^0.5.11;

import "./RollupUtils.sol";
import "../libraries/RollupTime.sol";
import "../challenge/ChallengeUtils.sol";
import "./VM.sol";

library NodeGraphUtils {
    using Hashing for Value.Data;

    struct AssertionData {
        bytes32 beforeVMHash;
        bytes32 beforeInboxTop;
        uint256 beforeInboxCount;
        bytes32 prevPrevLeafHash;
        uint256 prevDeadlineTicks;
        bytes32 prevDataHash;
        uint32 prevChildType;
        uint64 numSteps;
        uint256 importedMessageCount;
        bytes32 afterInboxTop;
        bytes32 importedMessagesSlice;
        bytes32 afterVMHash;
        bool didInboxInsn;
        uint64 numArbGas;
        bytes32 messagesAccHash;
        bytes32 logsAccHash;
    }

    function computePrevLeaf(AssertionData memory data)
        internal
        pure
        returns (bytes32, bytes32)
    {
        bytes32 vmProtoHashBefore = RollupUtils.protoStateHash(
            data.beforeVMHash,
            data.beforeInboxTop,
            data.beforeInboxCount
        );
        bytes32 prevLeaf = RollupUtils.childNodeHash(
            data.prevPrevLeafHash,
            data.prevDeadlineTicks,
            data.prevDataHash,
            data.prevChildType,
            vmProtoHashBefore
        );

        return (prevLeaf, vmProtoHashBefore);
    }

    function getTimeData(
        VM.Params memory vmParams,
        AssertionData memory data,
        uint256 blockNum
    ) internal pure returns (uint256, uint256) {
        uint256 checkTimeTicks = data.numArbGas /
            vmParams.arbGasSpeedLimitPerTick;
        uint256 deadlineTicks = RollupTime.blocksToTicks(blockNum) +
            vmParams.gracePeriodTicks;
        if (deadlineTicks < data.prevDeadlineTicks) {
            deadlineTicks = data.prevDeadlineTicks;
        }
        deadlineTicks += checkTimeTicks;

        return (checkTimeTicks, deadlineTicks);
    }

    function generateInvalidInboxTopLeaf(
        AssertionData memory data,
        bytes32 prevLeaf,
        uint256 deadlineTicks,
        bytes32 inboxValue,
        uint256 inboxCount,
        bytes32 vmProtoHashBefore,
        uint256 gracePeriodTicks
    ) internal pure returns (bytes32) {
        bytes32 challengeHash = ChallengeUtils.inboxTopHash(
            data.afterInboxTop,
            inboxValue,
            inboxCount - (data.beforeInboxCount + data.importedMessageCount)
        );
        return
            RollupUtils.childNodeHash(
                prevLeaf,
                deadlineTicks,
                RollupUtils.challengeDataHash(
                    challengeHash,
                    gracePeriodTicks + RollupTime.blocksToTicks(1)
                ),
                ChallengeUtils.getInvalidInboxType(),
                vmProtoHashBefore
            );
    }

    function generateInvalidMessagesLeaf(
        AssertionData memory data,
        bytes32 prevLeaf,
        uint256 deadlineTicks,
        bytes32 vmProtoHashBefore,
        uint256 gracePeriodTicks
    ) internal pure returns (bytes32) {
        bytes32 challengeHash = ChallengeUtils.messagesHash(
            data.beforeInboxTop,
            data.afterInboxTop,
            Value.newEmptyTuple().hash(),
            data.importedMessagesSlice,
            data.importedMessageCount
        );
        return
            RollupUtils.childNodeHash(
                prevLeaf,
                deadlineTicks,
                RollupUtils.challengeDataHash(
                    challengeHash,
                    gracePeriodTicks + RollupTime.blocksToTicks(1)
                ),
                ChallengeUtils.getInvalidMsgsType(),
                vmProtoHashBefore
            );
    }

    function generateInvalidExecutionLeaf(
        AssertionData memory data,
        bytes32 prevLeaf,
        uint256 deadlineTicks,
        bytes32 vmProtoHashBefore,
        uint256 gracePeriodTicks,
        uint256 checkTimeTicks
    ) internal pure returns (bytes32 leaf) {
        return
            RollupUtils.childNodeHash(
                prevLeaf,
                deadlineTicks,
                RollupUtils.challengeDataHash(
                    executionHash(data),
                    gracePeriodTicks + checkTimeTicks
                ),
                ChallengeUtils.getInvalidExType(),
                vmProtoHashBefore
            );
    }

    function generateValidLeaf(
        AssertionData memory data,
        bytes32 prevLeaf,
        uint256 deadlineTicks
    ) internal pure returns (bytes32) {
        return
            RollupUtils.childNodeHash(
                prevLeaf,
                deadlineTicks,
                RollupUtils.validDataHash(
                    data.messagesAccHash,
                    data.logsAccHash
                ),
                ChallengeUtils.getValidChildType(),
                RollupUtils.protoStateHash(
                    data.afterVMHash,
                    data.afterInboxTop,
                    data.beforeInboxCount + data.importedMessageCount
                )
            );
    }

    function executionHash(AssertionData memory data)
        private
        pure
        returns (bytes32)
    {
        return
            ChallengeUtils.executionHash(
                data.numSteps,
                data.beforeVMHash,
                data.importedMessagesSlice,
                data.afterVMHash,
                data.didInboxInsn,
                data.numArbGas,
                0x00,
                data.messagesAccHash,
                0x00,
                data.logsAccHash
            );
    }
}
