/* Generated by ts-generator ver. 0.0.8 */
/* tslint:disable */

import { Contract, ContractFactory, Signer } from 'ethers';
import { Provider } from 'ethers/providers';
import { UnsignedTransaction } from 'ethers/utils/transaction';

import { GlobalPendingInbox } from './GlobalPendingInbox';

export class GlobalPendingInboxFactory extends ContractFactory {
    constructor(signer?: Signer) {
        super(_abi, _bytecode, signer);
    }

    deploy(): Promise<GlobalPendingInbox> {
        return super.deploy() as Promise<GlobalPendingInbox>;
    }
    getDeployTransaction(): UnsignedTransaction {
        return super.getDeployTransaction();
    }
    attach(address: string): GlobalPendingInbox {
        return super.attach(address) as GlobalPendingInbox;
    }
    connect(signer: Signer): GlobalPendingInboxFactory {
        return super.connect(signer) as GlobalPendingInboxFactory;
    }
    static connect(address: string, signerOrProvider: Signer | Provider): GlobalPendingInbox {
        return new Contract(address, _abi, signerOrProvider) as GlobalPendingInbox;
    }
}

const _abi = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'chain',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'erc20',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'messageNum',
                type: 'uint256',
            },
        ],
        name: 'ERC20DepositMessageDelivered',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'chain',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'address',
                name: 'erc721',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'id',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'messageNum',
                type: 'uint256',
            },
        ],
        name: 'ERC721DepositMessageDelivered',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'chain',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'messageNum',
                type: 'uint256',
            },
        ],
        name: 'EthDepositMessageDelivered',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'chain',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'seqNumber',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
            {
                indexed: false,
                internalType: 'bytes',
                name: 'data',
                type: 'bytes',
            },
        ],
        name: 'TransactionMessageDelivered',
        type: 'event',
    },
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: '_tokenContract',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_owner',
                type: 'address',
            },
        ],
        name: 'getERC20Balance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: '_erc721',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_owner',
                type: 'address',
            },
        ],
        name: 'getERC721Tokens',
        outputs: [
            {
                internalType: 'uint256[]',
                name: '',
                type: 'uint256[]',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: '_owner',
                type: 'address',
            },
        ],
        name: 'getEthBalance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: '_erc721',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_owner',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256',
            },
        ],
        name: 'hasERC721',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: '_owner',
                type: 'address',
            },
        ],
        name: 'ownedERC20s',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: true,
        inputs: [
            {
                internalType: 'address',
                name: '_owner',
                type: 'address',
            },
        ],
        name: 'ownedERC721s',
        outputs: [
            {
                internalType: 'address[]',
                name: '',
                type: 'address[]',
            },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                internalType: 'address',
                name: '_tokenContract',
                type: 'address',
            },
        ],
        name: 'withdrawERC20',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                internalType: 'address',
                name: '_erc721',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_tokenId',
                type: 'uint256',
            },
        ],
        name: 'withdrawERC721',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'withdrawEth',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [],
        name: 'getPending',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                internalType: 'bytes',
                name: '_messages',
                type: 'bytes',
            },
        ],
        name: 'sendMessages',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                internalType: 'address',
                name: '_chain',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_seqNumber',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_value',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: '_data',
                type: 'bytes',
            },
            {
                internalType: 'bytes',
                name: '_signature',
                type: 'bytes',
            },
        ],
        name: 'forwardTransactionMessage',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                internalType: 'address',
                name: '_chain',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_seqNumber',
                type: 'uint256',
            },
            {
                internalType: 'uint256',
                name: '_value',
                type: 'uint256',
            },
            {
                internalType: 'bytes',
                name: '_data',
                type: 'bytes',
            },
        ],
        name: 'sendTransactionMessage',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                internalType: 'address',
                name: '_chain',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_to',
                type: 'address',
            },
        ],
        name: 'depositEthMessage',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                internalType: 'address',
                name: '_chain',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_to',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_erc20',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_value',
                type: 'uint256',
            },
        ],
        name: 'depositERC20Message',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        constant: false,
        inputs: [
            {
                internalType: 'address',
                name: '_chain',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_to',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '_erc721',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: '_id',
                type: 'uint256',
            },
        ],
        name: 'depositERC721Message',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

const _bytecode =
    '0x608060405234801561001057600080fd5b506121d9806100206000396000f3fe6080604052600436106100f35760003560e01c80638bef8df01161008a578063c3a8962c11610059578063c3a8962c1461051a578063e4eb8c6314610555578063f3e414f8146105d0578063f4f3b20014610609576100f3565b80638bef8df01461032c5780638f5ed73e1461041c578063a0ef91df146104bc578063bca22b76146104d1576100f3565b80634d2301cc116100c65780634d2301cc1461023b5780635bd21290146102805780636e2b89c5146102b05780638b7010aa146102e3576100f3565b80630758fb0a146100f857806311ae9ed21461018357806333f2ac42146101b157806345a53f09146101e4575b600080fd5b34801561010457600080fd5b506101336004803603604081101561011b57600080fd5b506001600160a01b038135811691602001351661063c565b60408051602080825283518183015283519192839290830191858101910280838360005b8381101561016f578181015183820152602001610157565b505050509050019250505060405180910390f35b34801561018f57600080fd5b50610198610702565b6040805192835260208301919091528051918290030190f35b3480156101bd57600080fd5b50610133600480360360208110156101d457600080fd5b50356001600160a01b031661071d565b3480156101f057600080fd5b506102276004803603606081101561020757600080fd5b506001600160a01b038135811691602081013590911690604001356107e0565b604080519115158252519081900360200190f35b34801561024757600080fd5b5061026e6004803603602081101561025e57600080fd5b50356001600160a01b0316610860565b60408051918252519081900360200190f35b6102ae6004803603604081101561029657600080fd5b506001600160a01b038135811691602001351661087b565b005b3480156102bc57600080fd5b50610133600480360360208110156102d357600080fd5b50356001600160a01b0316610894565b3480156102ef57600080fd5b506102ae6004803603608081101561030657600080fd5b506001600160a01b0381358116916020810135821691604082013516906060013561094b565b34801561033857600080fd5b506102ae600480360360c081101561034f57600080fd5b6001600160a01b03823581169260208101359091169160408201359160608101359181019060a081016080820135600160201b81111561038e57600080fd5b8201836020820111156103a057600080fd5b803590602001918460018302840111600160201b831117156103c157600080fd5b919390929091602081019035600160201b8111156103de57600080fd5b8201836020820111156103f057600080fd5b803590602001918460018302840111600160201b8311171561041157600080fd5b509092509050610969565b34801561042857600080fd5b506102ae600480360360a081101561043f57600080fd5b6001600160a01b03823581169260208101359091169160408201359160608101359181019060a081016080820135600160201b81111561047e57600080fd5b82018360208201111561049057600080fd5b803590602001918460018302840111600160201b831117156104b157600080fd5b509092509050610a75565b3480156104c857600080fd5b506102ae610ac1565b3480156104dd57600080fd5b506102ae600480360360808110156104f457600080fd5b506001600160a01b03813581169160208101358216916040820135169060600135610b0c565b34801561052657600080fd5b5061026e6004803603604081101561053d57600080fd5b506001600160a01b0381358116916020013516610b24565b34801561056157600080fd5b506102ae6004803603602081101561057857600080fd5b810190602081018135600160201b81111561059257600080fd5b8201836020820111156105a457600080fd5b803590602001918460018302840111600160201b831117156105c557600080fd5b509092509050610b8d565b3480156105dc57600080fd5b506102ae600480360360408110156105f357600080fd5b506001600160a01b038135169060200135610c51565b34801561061557600080fd5b506102ae6004803603602081101561062c57600080fd5b50356001600160a01b0316610d15565b6001600160a01b038082166000908152600260209081526040808320938616835290839052902054606091908061068557505060408051600081526020810190915290506106fc565b81600101600182038154811061069757fe5b90600052602060002090600302016002018054806020026020016040519081016040528092919081815260200182805480156106f257602002820191906000526020600020905b8154815260200190600101908083116106de575b5050505050925050505b92915050565b33600090815260036020526040902080546001909101549091565b6001600160a01b03811660009081526002602090815260409182902060018101548351818152818402810190930190935260609290918391801561076b578160200160208202803883390190505b50805190915060005b818110156107d65783600101818154811061078b57fe5b600091825260209091206003909102015483516001600160a01b03909116908490839081106107b657fe5b6001600160a01b0390921660209283029190910190910152600101610774565b5090949350505050565b6001600160a01b0380831660009081526002602090815260408083209387168352908390528120549091908061081b57600092505050610859565b81600101600182038154811061082d57fe5b906000526020600020906003020160010160008581526020019081526020016000205460001415925050505b9392505050565b6001600160a01b031660009081526020819052604090205490565b61088482610de2565b61089082823334610e01565b5050565b6001600160a01b038116600090815260016020818152604092839020918201548351818152818302810190920190935260609283919080156108e0578160200160208202803883390190505b50805190915060005b818110156107d65783600101818154811061090057fe5b600091825260209091206002909102015483516001600160a01b039091169084908390811061092b57fe5b6001600160a01b03909216602092830291909101909101526001016108e9565b610956828583610e9f565b6109638484338585610f1b565b50505050565b6000610a2489898989898960405160200180876001600160a01b03166001600160a01b031660601b8152601401866001600160a01b03166001600160a01b031660601b81526014018581526020018481526020018383808284378083019250505096505050505050506040516020818303038152906040528051906020012084848080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250610fb492505050565b9050610a6a8989838a8a8a8a8080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506110e792505050565b505050505050505050565b610ab9868633878787878080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152506110e792505050565b505050505050565b6000610acc33610860565b3360008181526020819052604080822082905551929350909183156108fc0291849190818181858888f19350505050158015610890573d6000803e3d6000fd5b610b178285836111d4565b6109638484338585611261565b6001600160a01b03808216600090815260016020908152604080832093861683529083905281205490919080610b5f576000925050506106fc565b816001016001820381548110610b7157fe5b9060005260206000209060020201600101549250505092915050565b6000808080845b80841015610c4857610bdd87878080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508892506112fa915050565b9297509095509350915084610bf157610c48565b610c3487878080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152508892508791506113bc9050565b909550935084610c4357610c48565b610b94565b50505050505050565b610c5c3383836114c0565b610cad576040805162461bcd60e51b815260206004820152601860248201527f57616c6c657420646f65736e2774206f776e20746f6b656e0000000000000000604482015290519081900360640190fd5b60408051632142170760e11b81523060048201523360248201526044810183905290516001600160a01b038416916342842e0e91606480830192600092919082900301818387803b158015610d0157600080fd5b505af1158015610ab9573d6000803e3d6000fd5b6000610d218233610b24565b9050610d2e338383611728565b610d695760405162461bcd60e51b815260040180806020018281038252602e815260200180612177602e913960400191505060405180910390fd5b6040805163a9059cbb60e01b81523360048201526024810183905290516001600160a01b0384169163a9059cbb9160448083019260209291908290030181600087803b158015610db857600080fd5b505af1158015610dcc573d6000803e3d6000fd5b505050506040513d602081101561096357600080fd5b6001600160a01b03166000908152602081905260409020805434019055565b6001600160a01b03841660009081526003602052604081206001908101540190610e2e85858543866118bb565b9050610e3a8682611926565b336001600160a01b0316856001600160a01b0316876001600160a01b03167ffd0d0553177fec183128f048fbde54554a3a67302f7ebd7f735215a3582907053486604051808381526020018281526020019250505060405180910390a4505050505050565b604080516323b872dd60e01b81523360048201523060248201526044810183905290516001600160a01b038516916323b872dd91606480830192600092919082900301818387803b158015610ef357600080fd5b505af1158015610f07573d6000803e3d6000fd5b50505050610f1682848361195c565b505050565b6001600160a01b03851660009081526003602052604081206001908101540190610f49868686864387611ae0565b9050610f558782611926565b604080516001600160a01b0386811682526020820186905281830185905291518288169289811692908b16917f40baf11a4a4a4be2a155dbf303fbaec6fabd52e267268bd7e3de4b4ed8a2e0959181900360600190a450505050505050565b60008060008060606040518060400160405280601c81526020017f19457468657265756d205369676e6564204d6573736167653a0a3332000000008152509050600081886040516020018083805190602001908083835b6020831061102a5780518252601f19909201916020918201910161100b565b51815160209384036101000a600019018019909216911617905292019384525060408051808503815293820190528251920191909120925061107191508890506000611afd565b6040805160008152602080820180845287905260ff8616828401526060820185905260808201849052915194995092975090955060019260a080840193601f198301929081900390910190855afa1580156110d0573d6000803e3d6000fd5b5050604051601f1901519998505050505050505050565b60006110f887878787878743611b8b565b90506111048782611926565b846001600160a01b0316866001600160a01b0316886001600160a01b03167fcf612c95e8993eca9c6e0be96b26b47022996db601dc12b4cf68ec37829d87b38787876040518084815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b8381101561118f578181015183820152602001611177565b50505050905090810190601f1680156111bc5780820380516001836020036101000a031916815260200191505b5094505050505060405180910390a450505050505050565b604080516323b872dd60e01b81523360048201523060248201526044810183905290516001600160a01b038516916323b872dd9160648083019260209291908290030181600087803b15801561122957600080fd5b505af115801561123d573d6000803e3d6000fd5b505050506040513d602081101561125357600080fd5b50610f169050828483611c80565b6001600160a01b0385166000908152600360205260408120600190810154019061128f868686864387611d57565b905061129b8782611926565b604080516001600160a01b0386811682526020820186905281830185905291518288169289811692908b16917fb13d04085b4a9f87fecfccf9b72081bb8a273498d6b08b4bccf2940d555b5e609181900360600190a450505050505050565b60008060008060008060008088905060008a828151811061131757fe5b016020015160019092019160f81c9050600681146113475750600097508896508795508594506113b39350505050565b6113518b83611d69565b9196509094509150846113765750600097508896508795508594506113b39350505050565b6113808b83611d69565b9196509093509150846113a55750600097508896508795508594506113b39350505050565b506001975095509093509150505b92959194509250565b6000806001831415611411576000806000806113d88989611de1565b9350935093509350836113f55760008895509550505050506114b8565b611400338383611e2e565b5060018395509550505050506114b8565b600283141561146a57600080600080600061142c8a8a611e8c565b945094509450945094508461144c576000899650965050505050506114b8565b61145833838584611f93565b506001849650965050505050506114b8565b60038314156114b15760008060008060006114858a8a611e8c565b94509450945094509450846114a5576000899650965050505050506114b8565b61145833838584611fc3565b5060009050825b935093915050565b6001600160a01b038084166000908152600260209081526040808320938616835290839052812054909190806114fb57600092505050610859565b600082600101600183038154811061150f57fe5b600091825260208083208884526001600390930201918201905260409091205490915080611544576000945050505050610859565b6002820180548291600185019160009190600019810190811061156357fe5b60009182526020808320909101548352820192909252604001902055600282018054600019810190811061159357fe5b90600052602060002001548260020160018303815481106115b057fe5b6000918252602080832090910192909255878152600184019091526040812055600282018054806115dd57fe5b600082815260208120820160001990810191909155019055600282015461171a576001840180548491869160009190600019810190811061161a57fe5b600091825260208083206003909202909101546001600160a01b03168352820192909252604001902055600184018054600019810190811061165857fe5b906000526020600020906003020184600101600185038154811061167857fe5b60009182526020909120825460039092020180546001600160a01b0319166001600160a01b03909216919091178155600280830180546116bb92840191906120ad565b5050506001600160a01b038716600090815260208590526040812055600184018054806116e457fe5b60008281526020812060036000199093019283020180546001600160a01b03191681559061171560028301826120fd565b505090555b506001979650505050505050565b60008161173757506001610859565b6001600160a01b0380851660009081526001602090815260408083209387168352908390529020548061176f57600092505050610859565b600082600101600183038154811061178357fe5b9060005260206000209060020201905080600101548511156117ab5760009350505050610859565b600181018054869003908190556118ae57600183018054839185916000919060001981019081106117d857fe5b600091825260208083206002909202909101546001600160a01b03168352820192909252604001902055600183018054600019810190811061181657fe5b906000526020600020906002020183600101600184038154811061183657fe5b60009182526020808320845460029093020180546001600160a01b0319166001600160a01b039384161781556001948501549085015590891682528590526040812055830180548061188457fe5b60008281526020812060026000199093019283020180546001600160a01b03191681556001015590555b5060019695505050505050565b60408051600160f81b6020808301919091526bffffffffffffffffffffffff19606089811b8216602185015288901b166035830152604982018690526069820185905260898083018590528351808403909101815260a9909201909252805191012095945050505050565b6001600160a01b0382166000908152600360205260409020805461194a9083611fe7565b81556001908101805490910190555050565b6001600160a01b03808416600090815260026020908152604080832093861683529083905290205480611a1c576040805180820182526001600160a01b0386811682528251600080825260208083019095528484019182526001878101805491820180825590835291869020855160039092020180546001600160a01b031916919094161783559051805191946119fb9260028501929091019061211e565b5050506001600160a01b038516600090815260208490526040902081905590505b6000826001016001830381548110611a3057fe5b9060005260206000209060030201905080600101600085815260200190815260200160002054600014611aaa576040805162461bcd60e51b815260206004820152601d60248201527f63616e27742061646420616c7265616479206f776e656420746f6b656e000000604482015290519081900360640190fd5b60028101805460018181018355600083815260208082209093018890559254968352909201909152604090209290925550505050565b6000611af26003888888888888612013565b979650505050505050565b604180820283810160208101516040820151919093015160ff169291601b841015611b2957601b840193505b8360ff16601b1480611b3e57508360ff16601c145b611b83576040805162461bcd60e51b8152602060048201526011602482015270496e636f727265637420762076616c756560781b604482015290519081900360640190fd5b509250925092565b60008088888888888888604051602001808960ff1660ff1660f81b8152600101886001600160a01b03166001600160a01b031660601b8152601401876001600160a01b03166001600160a01b031660601b8152601401866001600160a01b03166001600160a01b031660601b815260140185815260200184815260200183805190602001908083835b60208310611c335780518252601f199092019160209182019101611c14565b51815160001960209485036101000a019081169019919091161790529201938452506040805180850381529382019052825192019190912098505050505050505050979650505050505050565b80611c8a57610f16565b6001600160a01b03808416600090815260016020908152604080832093861683529083905290205480611d2357506040805180820182526001600160a01b0385811680835260006020808501828152600188810180548083018083559186528486209851600290910290980180546001600160a01b03191698909716979097178655905194019390935590815290849052919091208190555b82826001016001830381548110611d3657fe5b60009182526020909120600160029092020101805490910190555050505050565b6000611af26002888888888888612013565b6000806000808551905084811080611d8357506021858203105b80611da55750600060ff16868681518110611d9a57fe5b016020015160f81c14155b15611dba575060009250839150829050611dda565b600160218601611dd28888840163ffffffff61209116565b935093509350505b9250925092565b60008060008060008060008088905060008a8281518110611dfe57fe5b016020015160019092019160f81c9050600581146113475750600097508896508795508594506113b39350505050565b6001600160a01b038316600090815260208190526040812054821115611e5657506000610859565b506001600160a01b0392831660009081526020819052604080822080548490039055929093168352912080549091019055600190565b6000806000806000806000806000808a905060008c8281518110611eac57fe5b016020015160019092019160f81c905060068114611ee05750600099508a9850899750879650869550611f89945050505050565b611eea8d83611d69565b919750909550915085611f135750600099508a9850899750879650869550611f89945050505050565b611f1d8d83611d69565b919750909450915085611f465750600099508a9850899750879650869550611f89945050505050565b611f508d83611d69565b919750909350915085611f795750600099508a9850899750879650869550611f89945050505050565b5060019950975091955093509150505b9295509295909350565b6000611fa0858484611728565b611fac57506000611fbb565b611fb7848484611c80565b5060015b949350505050565b6000611fd08584846114c0565b611fdc57506000611fbb565b611fb784848461195c565b604080516020808201949094528082019290925280518083038201815260609092019052805191012090565b6040805160f89890981b6001600160f81b0319166020808a0191909152606097881b6bffffffffffffffffffffffff1990811660218b015296881b871660358a01529490961b9094166049870152605d860191909152607d850152609d808501929092528251808503909201825260bd909301909152805191012090565b600081602001835110156120a457600080fd5b50016020015190565b8280548282559060005260206000209081019282156120ed5760005260206000209182015b828111156120ed5782548255916001019190600101906120d2565b506120f9929150612159565b5090565b508054600082559060005260206000209081019061211b9190612159565b50565b8280548282559060005260206000209081019282156120ed579160200282015b828111156120ed57825182559160200191906001019061213e565b61217391905b808211156120f9576000815560010161215f565b9056fe57616c6c657420646f65736e2774206f776e2073756666696369656e742062616c616e6365206f6620746f6b656ea265627a7a72315820fc69a5f63dd542975f4a57e149fa05bc84451f1e577bb53a70e42216f807569964736f6c634300050f0032';
