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

#include "bigint_utils.hpp"

#include <sstream>
#include <string>

uint256_t from_hex_str(const std::string& s) {
    std::stringstream ss;
    ss << std::hex << s;
    uint256_t v;
    ss >> v;
    return v;
}

std::string to_hex_str(const uint256_t& v) {
    std::stringstream ss;
    ss << "0x" << std::hex << v;
    return ss.str();
}
