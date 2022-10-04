let Web3 = require('web3');

const ADD_GAS_LIMIT = "10";
const { BigNumber } = require('@ethersproject/bignumber');
let GafiTokenABI = require('../../build/contracts/GafiToken.json');
const { get_seeds, get_evm_acc } = require('../wallet/funded_wallets');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { BN } = require('@polkadot/util');

async function add_additional_gas(contract, address, add_gas_limit) {
    const gas_limit = await contract.estimateGas({ from: address });

    const additional_gas = BigNumber.from(gas_limit.toString())
        .mul(BigNumber.from(add_gas_limit)).div(BigNumber.from("100"));
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
        gas: await add_additional_gas(contract_data, account.address, "0"),
        gasPrice: await web3.eth.getGasPrice(),
        nonce,
    };

    let before_balance = await web3.eth.getBalance(account.address);

    const signed = await web3.eth.accounts.signTransaction(options, account.privateKey);

    const sentTx = await web3.eth.sendSignedTransaction(signed.raw || signed.rawTransaction);

    let after_balance = await web3.eth.getBalance(account.address);

    let fee = web3.utils.fromWei(BigNumber.from(before_balance).sub(BigNumber.from(after_balance)).toString(), "ether");
    console.log(`Create: ${index} - Fee: ${fee} - Gas used: ${sentTx.gasUsed}`);

    return sentTx.contractAddress;
}

async function transfer_token(count) {
    let web3 = new Web3();
    web3.setProvider(new web3.providers.HttpProvider(process.env.RPC));
    let seeds = await get_seeds();

    let tokens = [];

    for (let i = 0; i < seeds.length && i < count; i++) {
        let evm_acc = get_evm_acc(seeds[i]);

        let token_address = await create_token(web3, evm_acc, i);
        tokens.push(token_address);
    }

    for (let i = 0; i < seeds.length && i < count; i++) {
        let evm_acc = get_evm_acc(seeds[i]);
        await transfer_erc20_token(web3, evm_acc, tokens[i], i);
    }
}

async function transfer_erc20_token(web3, account, token, index) {
    const erc20_contract = new web3.eth.Contract(GafiTokenABI.abi, token);
    const contract = await erc20_contract.methods.transfer("0x000000000000000000000000000000000000dEaD", "10000000000000000000");

    let gas_limit = await add_additional_gas(contract, account.address, "0");

    const options = {
        to: token,
        data: contract.encodeABI(),
        gas: gas_limit,
        gasPrice: await web3.eth.getGasPrice()
    };

    let before_balance = await web3.eth.getBalance(account.address);

    const signed = await web3.eth.accounts.signTransaction(options, account.privateKey);
   const sentTx = await web3.eth.sendSignedTransaction(signed.raw || signed.rawTransaction);

    let after_balance = await web3.eth.getBalance(account.address);
    let fee = web3.utils.fromWei(BigNumber.from(before_balance).sub(BigNumber.from(after_balance)).toString(), "ether");
    console.log(`Transfer: ${index} - Fee: ${fee} - Gas used: ${sentTx.gasUsed}`);
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
    for (let i = 0; i < count; i++) {
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

async function get_fee_detail(block) {
    let provider = new WsProvider(process.env.WSS);
    let api = await ApiPromise.create({ provider });

    const blockHash = await api.rpc.chain.getBlockHash(block);
    const signedBlock = await api.rpc.chain.getBlock(blockHash);

    for (let i = 0; i < signedBlock.block.extrinsics.length; i++) {
        let extrinsic = signedBlock.block.extrinsics[i];
        console.log('extrinsic:', JSON.stringify(extrinsic.toHuman(), null, 2));

        const queryFeeDetails = await api.rpc.payment.queryFeeDetails(extrinsic.toHex(), blockHash);
        console.log('queryFeeDetails:', JSON.stringify(queryFeeDetails.toHuman(), null, 2));

        const queryInfo = await api.rpc.payment.queryInfo(extrinsic.toHex(), blockHash);
        console.log('queryInfo:', JSON.stringify(queryInfo.toHuman(), null, 2));
    }
}

module.exports = {
    create_token,
    create_tokens,
    get_tps,
    get_fee_detail,
    transfer_token
}
