
const { mnemonicGenerate } = require('@polkadot/util-crypto');
const fs = require('fs');
const { Keyring } = require('@polkadot/keyring');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const ethers = require('ethers');
const readline = require('node:readline');

require('dotenv').config();

async function get_seeds() {
    const fileStream = fs.createReadStream(process.env.WALLETS_PATH);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.
    var seeds = [];
    for await (const line of rl) {
        seeds.push(line);
    }
    return seeds;
}

function get_wallets(seeds) {
    let key_pairs = [];
    for (let i = 0; i < seeds.length; i++) {
        const pair = get_wallet(seeds[i]);
        key_pairs.push(pair);
    }
    return key_pairs;
}

function get_wallet(seed) {
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
    const pair = keyring.addFromUri(seed, { name: 'key pair' }, 'sr25519');
    return pair;
}

function get_evm_acc(seed) {
    let pure_seed = seed;

    let name_index = seed.indexOf("//");
    if (name_index != -1) {
        pure_seed = seed.slice(0, name_index);
    }

    let mnemonicWallet = ethers.Wallet.fromMnemonic(pure_seed);
    return mnemonicWallet;
}

function get_root_wallet() {
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
    const pair = keyring.addFromUri(process.env.ROOT, { name: 'key pair' }, 'sr25519');
    return pair;
}

async function funded_wallet(api, root, address, index = 0) {
    const txExecute = api.tx.balances.transfer(
        address,
        "10000000000000000000000"
    );
    await txExecute.signAndSend(root, { nonce: -1 });

    console.log(`Index: ${index} - funded: ${address}`);
}

async function get_faucet(api, sub_acc, index = 0) {
    const txExecute = api.tx.faucet.faucet();
    await txExecute.signAndSend(sub_acc);
    console.log(`Index: ${index} - funded: ${sub_acc.address}`);
}


async function funded_wallets() {
    let seeds = await get_seeds();

    let key_pairs = get_wallets(seeds);

    let root = get_root_wallet();

    console.log("root: ", root.address);

    let provider = new WsProvider(process.env.WSS);
    const api = await ApiPromise.create({ provider });

    let index = 0;
    for (const key of key_pairs) {
        await get_faucet(api, key, index);
        index++;
    }
}

module.exports = {
    funded_wallets,
    get_wallets,
    get_seeds,
    get_evm_acc,
    get_wallet,
}