module github.com/offchainlabs/arbitrum/tests/fibgo

go 1.13

require (
	github.com/ethereum/go-ethereum v1.9.16
	github.com/gorilla/rpc v1.2.0
	github.com/offchainlabs/arbitrum/packages/arb-avm-cpp v0.6.5
	github.com/offchainlabs/arbitrum/packages/arb-provider-go v0.6.5
	github.com/offchainlabs/arbitrum/packages/arb-util v0.6.5
	github.com/offchainlabs/arbitrum/packages/arb-validator v0.6.5
	github.com/offchainlabs/arbitrum/packages/arb-validator-core v0.6.5
)

replace github.com/offchainlabs/arbitrum/packages/arb-provider-go => ../../packages/arb-provider-go

replace github.com/offchainlabs/arbitrum/packages/arb-validator => ../../packages/arb-validator

replace github.com/offchainlabs/arbitrum/packages/arb-validator-core => ../../packages/arb-validator-core

replace github.com/offchainlabs/arbitrum/packages/arb-avm-cpp => ../../packages/arb-avm-cpp

replace github.com/offchainlabs/arbitrum/packages/arb-util => ../../packages/arb-util
