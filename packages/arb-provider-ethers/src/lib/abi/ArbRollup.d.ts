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

interface ArbRollupInterface extends Interface {
  functions: {
    VERSION: TypedFunctionDescription<{ encode([]: []): string }>

    challengeFactory: TypedFunctionDescription<{ encode([]: []): string }>

    confirm: TypedFunctionDescription<{
      encode([
        initalProtoStateHash,
        branches,
        deadlineTicks,
        challengeNodeData,
        logsAcc,
        vmProtoStateHashes,
        messageCounts,
        messages,
        stakerAddresses,
        stakerProofs,
        stakerProofOffsets,
      ]: [
        Arrayish,
        BigNumberish[],
        BigNumberish[],
        Arrayish[],
        Arrayish[],
        Arrayish[],
        BigNumberish[],
        Arrayish,
        string[],
        Arrayish[],
        BigNumberish[]
      ]): string
    }>

    getStakeRequired: TypedFunctionDescription<{ encode([]: []): string }>

    globalInbox: TypedFunctionDescription<{ encode([]: []): string }>

    init: TypedFunctionDescription<{
      encode([
        _vmState,
        _gracePeriodTicks,
        _arbGasSpeedLimitPerTick,
        _maxExecutionSteps,
        _stakeRequirement,
        _owner,
        _challengeFactoryAddress,
        _globalInboxAddress,
        _extraConfig,
      ]: [
        Arrayish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        string,
        string,
        string,
        Arrayish
      ]): string
    }>

    isStaked: TypedFunctionDescription<{
      encode([_stakerAddress]: [string]): string
    }>

    isValidLeaf: TypedFunctionDescription<{
      encode([leaf]: [Arrayish]): string
    }>

    latestConfirmed: TypedFunctionDescription<{ encode([]: []): string }>

    makeAssertion: TypedFunctionDescription<{
      encode([
        fields,
        validBlockHeightPrecondition,
        beforeInboxCount,
        prevDeadlineTicks,
        prevChildType,
        numSteps,
        importedMessageCount,
        didInboxInsn,
        numArbGas,
        stakerProof,
      ]: [
        Arrayish[],
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        BigNumberish,
        boolean,
        BigNumberish,
        Arrayish[]
      ]): string
    }>

    moveStake: TypedFunctionDescription<{
      encode([proof1, proof2]: [Arrayish[], Arrayish[]]): string
    }>

    owner: TypedFunctionDescription<{ encode([]: []): string }>

    ownerShutdown: TypedFunctionDescription<{ encode([]: []): string }>

    placeStake: TypedFunctionDescription<{
      encode([proof1, proof2]: [Arrayish[], Arrayish[]]): string
    }>

    pruneLeaves: TypedFunctionDescription<{
      encode([
        fromNodes,
        leafProofs,
        leafProofLengths,
        latestConfProofs,
        latestConfirmedProofLengths,
      ]: [
        Arrayish[],
        Arrayish[],
        BigNumberish[],
        Arrayish[],
        BigNumberish[]
      ]): string
    }>

    recoverStakeConfirmed: TypedFunctionDescription<{
      encode([proof]: [Arrayish[]]): string
    }>

    recoverStakeMooted: TypedFunctionDescription<{
      encode([stakerAddress, node, latestConfirmedProof, stakerProof]: [
        string,
        Arrayish,
        Arrayish[],
        Arrayish[]
      ]): string
    }>

    recoverStakeOld: TypedFunctionDescription<{
      encode([stakerAddress, proof]: [string, Arrayish[]]): string
    }>

    recoverStakePassedDeadline: TypedFunctionDescription<{
      encode([
        stakerAddress,
        deadlineTicks,
        disputableNodeHashVal,
        childType,
        vmProtoStateHash,
        proof,
      ]: [
        string,
        BigNumberish,
        Arrayish,
        BigNumberish,
        Arrayish,
        Arrayish[]
      ]): string
    }>

    resolveChallenge: TypedFunctionDescription<{
      encode([winner, loser]: [string, string]): string
    }>

    startChallenge: TypedFunctionDescription<{
      encode([
        asserterAddress,
        challengerAddress,
        prevNode,
        deadlineTicks,
        stakerNodeTypes,
        vmProtoHashes,
        asserterProof,
        challengerProof,
        asserterNodeHash,
        challengerDataHash,
        challengerPeriodTicks,
      ]: [
        string,
        string,
        Arrayish,
        BigNumberish,
        BigNumberish[],
        Arrayish[],
        Arrayish[],
        Arrayish[],
        Arrayish,
        Arrayish,
        BigNumberish
      ]): string
    }>

    vmParams: TypedFunctionDescription<{ encode([]: []): string }>
  }

  events: {
    ConfirmedAssertion: TypedEventDescription<{
      encodeTopics([logsAccHash]: [null]): string[]
    }>

    ConfirmedValidAssertion: TypedEventDescription<{
      encodeTopics([nodeHash]: [Arrayish | null]): string[]
    }>

    RollupAsserted: TypedEventDescription<{
      encodeTopics([
        fields,
        inboxCount,
        importedMessageCount,
        numArbGas,
        numSteps,
        didInboxInsn,
      ]: [null, null, null, null, null, null]): string[]
    }>

    RollupChallengeCompleted: TypedEventDescription<{
      encodeTopics([challengeContract, winner, loser]: [
        null,
        null,
        null
      ]): string[]
    }>

    RollupChallengeStarted: TypedEventDescription<{
      encodeTopics([asserter, challenger, challengeType, challengeContract]: [
        null,
        null,
        null,
        null
      ]): string[]
    }>

    RollupConfirmed: TypedEventDescription<{
      encodeTopics([nodeHash]: [null]): string[]
    }>

    RollupCreated: TypedEventDescription<{
      encodeTopics([
        initVMHash,
        gracePeriodTicks,
        arbGasSpeedLimitPerTick,
        maxExecutionSteps,
        stakeRequirement,
        owner,
        extraConfig,
      ]: [null, null, null, null, null, null, null]): string[]
    }>

    RollupPruned: TypedEventDescription<{
      encodeTopics([leaf]: [null]): string[]
    }>

    RollupStakeCreated: TypedEventDescription<{
      encodeTopics([staker, nodeHash]: [null, null]): string[]
    }>

    RollupStakeMoved: TypedEventDescription<{
      encodeTopics([staker, toNodeHash]: [null, null]): string[]
    }>

    RollupStakeRefunded: TypedEventDescription<{
      encodeTopics([staker]: [null]): string[]
    }>
  }
}

export class ArbRollup extends Contract {
  connect(signerOrProvider: Signer | Provider | string): ArbRollup
  attach(addressOrName: string): ArbRollup
  deployed(): Promise<ArbRollup>

  on(event: EventFilter | string, listener: Listener): ArbRollup
  once(event: EventFilter | string, listener: Listener): ArbRollup
  addListener(eventName: EventFilter | string, listener: Listener): ArbRollup
  removeAllListeners(eventName: EventFilter | string): ArbRollup
  removeListener(eventName: any, listener: Listener): ArbRollup

  interface: ArbRollupInterface

  functions: {
    VERSION(): Promise<string>

    challengeFactory(): Promise<string>

    confirm(
      initalProtoStateHash: Arrayish,
      branches: BigNumberish[],
      deadlineTicks: BigNumberish[],
      challengeNodeData: Arrayish[],
      logsAcc: Arrayish[],
      vmProtoStateHashes: Arrayish[],
      messageCounts: BigNumberish[],
      messages: Arrayish,
      stakerAddresses: string[],
      stakerProofs: Arrayish[],
      stakerProofOffsets: BigNumberish[],
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>

    getStakeRequired(): Promise<BigNumber>

    globalInbox(): Promise<string>

    init(
      _vmState: Arrayish,
      _gracePeriodTicks: BigNumberish,
      _arbGasSpeedLimitPerTick: BigNumberish,
      _maxExecutionSteps: BigNumberish,
      _stakeRequirement: BigNumberish,
      _owner: string,
      _challengeFactoryAddress: string,
      _globalInboxAddress: string,
      _extraConfig: Arrayish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>

    isStaked(_stakerAddress: string): Promise<boolean>

    isValidLeaf(leaf: Arrayish): Promise<boolean>

    latestConfirmed(): Promise<string>

    makeAssertion(
      fields: Arrayish[],
      validBlockHeightPrecondition: BigNumberish,
      beforeInboxCount: BigNumberish,
      prevDeadlineTicks: BigNumberish,
      prevChildType: BigNumberish,
      numSteps: BigNumberish,
      importedMessageCount: BigNumberish,
      didInboxInsn: boolean,
      numArbGas: BigNumberish,
      stakerProof: Arrayish[],
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>

    moveStake(
      proof1: Arrayish[],
      proof2: Arrayish[],
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>

    owner(): Promise<string>

    ownerShutdown(
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>

    placeStake(
      proof1: Arrayish[],
      proof2: Arrayish[],
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>

    pruneLeaves(
      fromNodes: Arrayish[],
      leafProofs: Arrayish[],
      leafProofLengths: BigNumberish[],
      latestConfProofs: Arrayish[],
      latestConfirmedProofLengths: BigNumberish[],
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>

    recoverStakeConfirmed(
      proof: Arrayish[],
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>

    recoverStakeMooted(
      stakerAddress: string,
      node: Arrayish,
      latestConfirmedProof: Arrayish[],
      stakerProof: Arrayish[],
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>

    recoverStakeOld(
      stakerAddress: string,
      proof: Arrayish[],
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>

    recoverStakePassedDeadline(
      stakerAddress: string,
      deadlineTicks: BigNumberish,
      disputableNodeHashVal: Arrayish,
      childType: BigNumberish,
      vmProtoStateHash: Arrayish,
      proof: Arrayish[],
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>

    resolveChallenge(
      winner: string,
      loser: string,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>

    startChallenge(
      asserterAddress: string,
      challengerAddress: string,
      prevNode: Arrayish,
      deadlineTicks: BigNumberish,
      stakerNodeTypes: BigNumberish[],
      vmProtoHashes: Arrayish[],
      asserterProof: Arrayish[],
      challengerProof: Arrayish[],
      asserterNodeHash: Arrayish,
      challengerDataHash: Arrayish,
      challengerPeriodTicks: BigNumberish,
      overrides?: TransactionOverrides
    ): Promise<ContractTransaction>

    vmParams(): Promise<{
      gracePeriodTicks: BigNumber
      arbGasSpeedLimitPerTick: BigNumber
      maxExecutionSteps: BigNumber
      0: BigNumber
      1: BigNumber
      2: BigNumber
    }>
  }

  VERSION(): Promise<string>

  challengeFactory(): Promise<string>

  confirm(
    initalProtoStateHash: Arrayish,
    branches: BigNumberish[],
    deadlineTicks: BigNumberish[],
    challengeNodeData: Arrayish[],
    logsAcc: Arrayish[],
    vmProtoStateHashes: Arrayish[],
    messageCounts: BigNumberish[],
    messages: Arrayish,
    stakerAddresses: string[],
    stakerProofs: Arrayish[],
    stakerProofOffsets: BigNumberish[],
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>

  getStakeRequired(): Promise<BigNumber>

  globalInbox(): Promise<string>

  init(
    _vmState: Arrayish,
    _gracePeriodTicks: BigNumberish,
    _arbGasSpeedLimitPerTick: BigNumberish,
    _maxExecutionSteps: BigNumberish,
    _stakeRequirement: BigNumberish,
    _owner: string,
    _challengeFactoryAddress: string,
    _globalInboxAddress: string,
    _extraConfig: Arrayish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>

  isStaked(_stakerAddress: string): Promise<boolean>

  isValidLeaf(leaf: Arrayish): Promise<boolean>

  latestConfirmed(): Promise<string>

  makeAssertion(
    fields: Arrayish[],
    validBlockHeightPrecondition: BigNumberish,
    beforeInboxCount: BigNumberish,
    prevDeadlineTicks: BigNumberish,
    prevChildType: BigNumberish,
    numSteps: BigNumberish,
    importedMessageCount: BigNumberish,
    didInboxInsn: boolean,
    numArbGas: BigNumberish,
    stakerProof: Arrayish[],
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>

  moveStake(
    proof1: Arrayish[],
    proof2: Arrayish[],
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>

  owner(): Promise<string>

  ownerShutdown(overrides?: TransactionOverrides): Promise<ContractTransaction>

  placeStake(
    proof1: Arrayish[],
    proof2: Arrayish[],
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>

  pruneLeaves(
    fromNodes: Arrayish[],
    leafProofs: Arrayish[],
    leafProofLengths: BigNumberish[],
    latestConfProofs: Arrayish[],
    latestConfirmedProofLengths: BigNumberish[],
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>

  recoverStakeConfirmed(
    proof: Arrayish[],
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>

  recoverStakeMooted(
    stakerAddress: string,
    node: Arrayish,
    latestConfirmedProof: Arrayish[],
    stakerProof: Arrayish[],
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>

  recoverStakeOld(
    stakerAddress: string,
    proof: Arrayish[],
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>

  recoverStakePassedDeadline(
    stakerAddress: string,
    deadlineTicks: BigNumberish,
    disputableNodeHashVal: Arrayish,
    childType: BigNumberish,
    vmProtoStateHash: Arrayish,
    proof: Arrayish[],
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>

  resolveChallenge(
    winner: string,
    loser: string,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>

  startChallenge(
    asserterAddress: string,
    challengerAddress: string,
    prevNode: Arrayish,
    deadlineTicks: BigNumberish,
    stakerNodeTypes: BigNumberish[],
    vmProtoHashes: Arrayish[],
    asserterProof: Arrayish[],
    challengerProof: Arrayish[],
    asserterNodeHash: Arrayish,
    challengerDataHash: Arrayish,
    challengerPeriodTicks: BigNumberish,
    overrides?: TransactionOverrides
  ): Promise<ContractTransaction>

  vmParams(): Promise<{
    gracePeriodTicks: BigNumber
    arbGasSpeedLimitPerTick: BigNumber
    maxExecutionSteps: BigNumber
    0: BigNumber
    1: BigNumber
    2: BigNumber
  }>

  filters: {
    ConfirmedAssertion(logsAccHash: null): EventFilter

    ConfirmedValidAssertion(nodeHash: Arrayish | null): EventFilter

    RollupAsserted(
      fields: null,
      inboxCount: null,
      importedMessageCount: null,
      numArbGas: null,
      numSteps: null,
      didInboxInsn: null
    ): EventFilter

    RollupChallengeCompleted(
      challengeContract: null,
      winner: null,
      loser: null
    ): EventFilter

    RollupChallengeStarted(
      asserter: null,
      challenger: null,
      challengeType: null,
      challengeContract: null
    ): EventFilter

    RollupConfirmed(nodeHash: null): EventFilter

    RollupCreated(
      initVMHash: null,
      gracePeriodTicks: null,
      arbGasSpeedLimitPerTick: null,
      maxExecutionSteps: null,
      stakeRequirement: null,
      owner: null,
      extraConfig: null
    ): EventFilter

    RollupPruned(leaf: null): EventFilter

    RollupStakeCreated(staker: null, nodeHash: null): EventFilter

    RollupStakeMoved(staker: null, toNodeHash: null): EventFilter

    RollupStakeRefunded(staker: null): EventFilter
  }

  estimate: {
    VERSION(): Promise<BigNumber>

    challengeFactory(): Promise<BigNumber>

    confirm(
      initalProtoStateHash: Arrayish,
      branches: BigNumberish[],
      deadlineTicks: BigNumberish[],
      challengeNodeData: Arrayish[],
      logsAcc: Arrayish[],
      vmProtoStateHashes: Arrayish[],
      messageCounts: BigNumberish[],
      messages: Arrayish,
      stakerAddresses: string[],
      stakerProofs: Arrayish[],
      stakerProofOffsets: BigNumberish[]
    ): Promise<BigNumber>

    getStakeRequired(): Promise<BigNumber>

    globalInbox(): Promise<BigNumber>

    init(
      _vmState: Arrayish,
      _gracePeriodTicks: BigNumberish,
      _arbGasSpeedLimitPerTick: BigNumberish,
      _maxExecutionSteps: BigNumberish,
      _stakeRequirement: BigNumberish,
      _owner: string,
      _challengeFactoryAddress: string,
      _globalInboxAddress: string,
      _extraConfig: Arrayish
    ): Promise<BigNumber>

    isStaked(_stakerAddress: string): Promise<BigNumber>

    isValidLeaf(leaf: Arrayish): Promise<BigNumber>

    latestConfirmed(): Promise<BigNumber>

    makeAssertion(
      fields: Arrayish[],
      validBlockHeightPrecondition: BigNumberish,
      beforeInboxCount: BigNumberish,
      prevDeadlineTicks: BigNumberish,
      prevChildType: BigNumberish,
      numSteps: BigNumberish,
      importedMessageCount: BigNumberish,
      didInboxInsn: boolean,
      numArbGas: BigNumberish,
      stakerProof: Arrayish[]
    ): Promise<BigNumber>

    moveStake(proof1: Arrayish[], proof2: Arrayish[]): Promise<BigNumber>

    owner(): Promise<BigNumber>

    ownerShutdown(): Promise<BigNumber>

    placeStake(proof1: Arrayish[], proof2: Arrayish[]): Promise<BigNumber>

    pruneLeaves(
      fromNodes: Arrayish[],
      leafProofs: Arrayish[],
      leafProofLengths: BigNumberish[],
      latestConfProofs: Arrayish[],
      latestConfirmedProofLengths: BigNumberish[]
    ): Promise<BigNumber>

    recoverStakeConfirmed(proof: Arrayish[]): Promise<BigNumber>

    recoverStakeMooted(
      stakerAddress: string,
      node: Arrayish,
      latestConfirmedProof: Arrayish[],
      stakerProof: Arrayish[]
    ): Promise<BigNumber>

    recoverStakeOld(
      stakerAddress: string,
      proof: Arrayish[]
    ): Promise<BigNumber>

    recoverStakePassedDeadline(
      stakerAddress: string,
      deadlineTicks: BigNumberish,
      disputableNodeHashVal: Arrayish,
      childType: BigNumberish,
      vmProtoStateHash: Arrayish,
      proof: Arrayish[]
    ): Promise<BigNumber>

    resolveChallenge(winner: string, loser: string): Promise<BigNumber>

    startChallenge(
      asserterAddress: string,
      challengerAddress: string,
      prevNode: Arrayish,
      deadlineTicks: BigNumberish,
      stakerNodeTypes: BigNumberish[],
      vmProtoHashes: Arrayish[],
      asserterProof: Arrayish[],
      challengerProof: Arrayish[],
      asserterNodeHash: Arrayish,
      challengerDataHash: Arrayish,
      challengerPeriodTicks: BigNumberish
    ): Promise<BigNumber>

    vmParams(): Promise<BigNumber>
  }
}
