// SPDX-License-Identifier: Apache-2.0

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

pragma solidity ^0.5.11;

import "../arch/Marshaling.sol";
import "../libraries/RollupTime.sol";

library RollupUtils {
    using Hashing for Value.Data;

    uint256 private constant VALID_CHILD_TYPE = 3;

    struct ConfirmData {
        bytes32 initalProtoStateHash;
        uint256[] branches;
        uint256[] deadlineTicks;
        bytes32[] challengeNodeData;
        bytes32[] logsAcc;
        bytes32[] vmProtoStateHashes;
        uint256[] messageCounts;
        bytes messages;
    }

    struct NodeData {
        uint256 validNum;
        uint256 invalidNum;
        uint256 messagesOffset;
        bytes32 vmProtoStateHash;
        bytes32 nodeHash;
    }

    function getInitialNodeData(bytes32 vmProtoStateHash, bytes32 confNode)
        private
        pure
        returns (NodeData memory)
    {
        return NodeData(0, 0, 0, vmProtoStateHash, confNode);
    }

    function confirm(ConfirmData memory data, bytes32 confNode)
        internal
        pure
        returns (bytes32[] memory validNodeHashes, bytes32)
    {
        verifyDataLength(data);

        uint256 nodeCount = data.branches.length;
        uint256 validNodeCount = data.messageCounts.length;
        validNodeHashes = new bytes32[](validNodeCount);
        NodeData memory currentNodeData = getInitialNodeData(
            data.initalProtoStateHash,
            confNode
        );
        bool isValidChildType;

        for (uint256 nodeIndex = 0; nodeIndex < nodeCount; nodeIndex++) {
            (currentNodeData, isValidChildType) = processNode(
                data,
                currentNodeData,
                nodeIndex
            );

            if (isValidChildType) {
                validNodeHashes[currentNodeData.validNum - 1] = currentNodeData
                    .nodeHash;
            }
        }
        return (validNodeHashes, currentNodeData.nodeHash);
    }

    function processNode(
        ConfirmData memory data,
        NodeData memory nodeData,
        uint256 nodeIndex
    ) private pure returns (NodeData memory, bool) {
        uint256 branchType = data.branches[nodeIndex];
        bool isValidChildType = (branchType == VALID_CHILD_TYPE);
        bytes32 nodeDataHash;

        if (isValidChildType) {
            (
                nodeData.messagesOffset,
                nodeDataHash,
                nodeData.vmProtoStateHash
            ) = processValidNode(
                data,
                nodeData.validNum,
                nodeData.messagesOffset
            );
            nodeData.validNum++;
        } else {
            nodeDataHash = data.challengeNodeData[nodeData.invalidNum];
            nodeData.invalidNum++;
        }

        nodeData.nodeHash = childNodeHash(
            nodeData.nodeHash,
            data.deadlineTicks[nodeIndex],
            nodeDataHash,
            branchType,
            nodeData.vmProtoStateHash
        );

        return (nodeData, isValidChildType);
    }

    function processValidNode(
        ConfirmData memory data,
        uint256 validNum,
        uint256 startOffset
    )
        internal
        pure
        returns (
            uint256,
            bytes32,
            bytes32
        )
    {
        (bytes32 lastMsgHash, uint256 messagesOffset) = generateLastMessageHash(
            data.messages,
            startOffset,
            data.messageCounts[validNum]
        );
        bytes32 nodeDataHash = validDataHash(
            lastMsgHash,
            data.logsAcc[validNum]
        );
        bytes32 vmProtoStateHash = data.vmProtoStateHashes[validNum];
        return (messagesOffset, nodeDataHash, vmProtoStateHash);
    }

    function generateLastMessageHash(
        bytes memory messages,
        uint256 startOffset,
        uint256 count
    ) internal pure returns (bytes32, uint256) {
        bytes32 hashVal = 0x00;
        Value.Data memory messageVal;
        uint256 offset = startOffset;
        for (uint256 i = 0; i < count; i++) {
            (offset, messageVal) = Marshaling.deserialize(messages, offset);
            hashVal = keccak256(abi.encodePacked(hashVal, messageVal.hash()));
        }
        return (hashVal, offset);
    }

    function verifyDataLength(RollupUtils.ConfirmData memory data)
        private
        pure
    {
        uint256 nodeCount = data.branches.length;
        uint256 validNodeCount = data.messageCounts.length;
        require(data.vmProtoStateHashes.length == validNodeCount);
        require(data.logsAcc.length == validNodeCount);
        require(data.deadlineTicks.length == nodeCount);
        require(data.challengeNodeData.length == nodeCount - validNodeCount);
    }

    function protoStateHash(
        bytes32 machineHash,
        bytes32 inboxTop,
        uint256 inboxCount
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(machineHash, inboxTop, inboxCount));
    }

    function validDataHash(bytes32 messagesAcc, bytes32 logsAcc)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(messagesAcc, logsAcc));
    }

    function challengeDataHash(bytes32 challenge, uint256 challengePeriod)
        internal
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(challenge, challengePeriod));
    }

    function childNodeHash(
        bytes32 prevNodeHash,
        uint256 deadlineTicks,
        bytes32 nodeDataHash,
        uint256 childType,
        bytes32 vmProtoStateHash
    ) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    prevNodeHash,
                    keccak256(
                        abi.encodePacked(
                            vmProtoStateHash,
                            deadlineTicks,
                            nodeDataHash,
                            childType
                        )
                    )
                )
            );
    }

    function calculateLeafFromPath(bytes32 from, bytes32[] memory proof)
        internal
        pure
        returns (bytes32)
    {
        return calculateLeafFromPath(from, proof, 0, proof.length);
    }

    function calculateLeafFromPath(
        bytes32 from,
        bytes32[] memory proof,
        uint256 start,
        uint256 end
    ) internal pure returns (bytes32) {
        bytes32 node = from;
        for (uint256 i = start; i < end; i++) {
            node = keccak256(abi.encodePacked(node, proof[i]));
        }
        return node;
    }
}
