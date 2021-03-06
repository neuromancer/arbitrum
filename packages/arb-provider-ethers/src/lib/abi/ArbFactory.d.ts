/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractTransaction, EventFilter, Signer } from 'ethers'
import { Listener, Provider } from 'ethers/providers'
import { Arrayish, BigNumber, BigNumberish, Interface } from 'ethers/utils'
import {
  TransactionOverrides,
  TypedEventDescription,
  TypedFunctionDescription,
} from '.'

interface ArbFactoryInterface extends Interface {
  functions: {
    challengeFactoryAddress: TypedFunctionDescription<{
      encode([]: []): string
    }>

    createRollup: TypedFunctionDescription<{
      encode([
        _vmState,
        _gracePeriodTicks,
        _arbGasSpeedLimitPerTick,
        _maxExecutionSteps,
        _stakeRequirement,
        _owner,
        _extraConfig,
      ]: [
        Arrayish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        string,
        Arrayish
      ]): string
    }>

    globalInboxAddress: TypedFunctionDescription<{ encode([]: []): string }>

    rollupTemplate: TypedFunctionDescription<{ encode([]: []): string }>
  }

  events: {
    RollupCreated: TypedEventDescription<{
      encodeTopics([rollupAddress]: [null]): string[]
    }>
  }
}

export class ArbFactory extends Contract {
  connect(signerOrProvider: Signer | Provider | string): ArbFactory
  attach(addressOrName: string): ArbFactory
  deployed(): Promise<ArbFactory>

  on(event: EventFilter | string, listener: Listener): ArbFactory
  once(event: EventFilter | string, listener: Listener): ArbFactory
  addListener(eventName: EventFilter | string, listener: Listener): ArbFactory
  removeAllListeners(eventName: EventFilter | string): ArbFactory
  removeListener(eventName: any, listener: Listener): ArbFactory

  interface: ArbFactoryInterface

  functions: {
    challengeFactoryAddress(): Promise<string>

    createRollup(
      _vmState: Arrayish,
      _gracePeriodTicks: BigNumberish,
      _arbGasSpeedLimitPerTick: BigNumberish,
      _maxExecutionSteps: BigNumberish,
      _stakeRequirement: BigNumberish,
      _owner: string,
      _extraConfig: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>

    globalInboxAddress(): Promise<string>

    rollupTemplate(): Promise<string>
  }

  challengeFactoryAddress(): Promise<string>

  createRollup(
    _vmState: Arrayish,
    _gracePeriodTicks: BigNumberish,
    _arbGasSpeedLimitPerTick: BigNumberish,
    _maxExecutionSteps: BigNumberish,
    _stakeRequirement: BigNumberish,
    _owner: string,
    _extraConfig: Arrayish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>

  globalInboxAddress(): Promise<string>

  rollupTemplate(): Promise<string>

  filters: {
    RollupCreated(rollupAddress: null): EventFilter
  }

  estimate: {
    challengeFactoryAddress(): Promise<BigNumber>

    createRollup(
      _vmState: Arrayish,
      _gracePeriodTicks: BigNumberish,
      _arbGasSpeedLimitPerTick: BigNumberish,
      _maxExecutionSteps: BigNumberish,
      _stakeRequirement: BigNumberish,
      _owner: string,
      _extraConfig: Arrayish
    ): Promise<BigNumber>

    globalInboxAddress(): Promise<BigNumber>

    rollupTemplate(): Promise<BigNumber>
  }
}
