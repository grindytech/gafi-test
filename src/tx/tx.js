let Web3 = require('web3');

const ADD_GAS_LIMIT = "10";
const { BigNumber } = require('@ethersproject/bignumber');
let GafiTokenABI = require('../../build/contracts/GafiToken.json');
const { get_seeds, get_evm_acc } = require('../wallet/funded_wallets');
const { ApiPromise, WsProvider } = require('@polkadot/api');

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

async function create_tokens(count) {
    let web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(process.env.RPC));

    let seeds = await get_seeds();

    for (let i = 0; i < seeds.length && i < count; i++) {
        let evm_acc = get_evm_acc(seeds[i]);

        create_token(web3, evm_acc, i);
    }
}

async function get_tps(count) {

    let provider = new WsProvider(process.env.WSS);
    let api = await ApiPromise.create({ provider });
    
    let block_number = (await api.query.system.number()).toHuman();

    let total_txs = 0;
    let total_block_length = 0;
    for(let i = 0; i < count; i++) {
        let block = block_number - i;
        const blockHash = await api.rpc.chain.getBlockHash(block);
        const signedBlock = await api.rpc.chain.getBlock(blockHash);

        console.log(`block number: ${block} - ${signedBlock.block.extrinsics.length}`);
        console.log(`block length: ${signedBlock.block.encodedLength}`)
        total_txs += signedBlock.block.extrinsics.length;
        total_block_length += signedBlock.block.encodedLength;
    }
    
    console.log("Total TXs: ", total_txs);
    console.log("Total Block Length: ", total_block_length);

}

module.exports = {
    create_token,
    create_tokens,
    get_tps
}
