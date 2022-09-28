let Web3 = require('web3');

const ADD_GAS_LIMIT = "10";
const { BigNumber } = require('@ethersproject/bignumber');
let GafiTokenABI = require('../../build/contracts/GafiToken.json');
const { get_seeds, get_evm_acc } = require('../wallet/funded_wallets');

async function add_additional_gas(contract, address) {
    const gas_limit = await contract.estimateGas({ from: address });

    const additional_gas = BigNumber.from(gas_limit.toString())
        .mul(BigNumber.from(ADD_GAS_LIMIT)).div(BigNumber.from("100"));
    return BigNumber.from(gas_limit.toString()).add(additional_gas).toString();
}


async function create_token(web3, account, index = 0) {
    const arguments = [
    ];
    const contract = new web3.eth.Contract(GafiTokenABI.abi);
    const contract_data = await contract.deploy({
        data: GafiTokenABI.bytecode,
        arguments: arguments
    });
    const nonce = await web3.eth.getTransactionCount(account.address, "pending");
    const options = {
        data: contract_data.encodeABI(),
        gas: await add_additional_gas(contract_data, account.address),
        gasPrice: await web3.eth.getGasPrice(),
        nonce,
    };
    const signed = await web3.eth.accounts.signTransaction(options, account.privateKey);

    const sentTx = await web3.eth.sendSignedTransaction(signed.raw || signed.rawTransaction);
    console.log(`Index: ${index} - Tx: ${sentTx.transactionHash}`);
    return sentTx;
}

async function create_tokens() {
    let web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(process.env.RPC));


    let seeds = await get_seeds();

    for (let i = 0; i < seeds.length; i++) {
        let evm_acc = get_evm_acc(seeds[i]);

        create_token(web3, evm_acc, i);
    }
}

module.exports = {
    create_token,
    create_tokens
}
