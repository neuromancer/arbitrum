module github.com/offchainlabs/arbitrum/packages/arb-provider-go

go 1.13

require (
	github.com/ethereum/go-ethereum v1.9.16
	github.com/gorilla/rpc v1.2.0
	github.com/offchainlabs/arbitrum/packages/arb-util v0.6.5
	github.com/offchainlabs/arbitrum/packages/arb-validator-core v0.6.5
	github.com/pkg/errors v0.9.1
)

replace github.com/offchainlabs/arbitrum/packages/arb-validator-core => ../arb-validator-core

replace github.com/offchainlabs/arbitrum/packages/arb-util => ../arb-util
