
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
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
    let key_pairs = [];
    for (const seed in seeds) {
        const pair = keyring.addFromUri(seed, { name: 'key pair' }, 'sr25519');
        key_pairs.push(pair);
    }
    return key_pairs;
}

function get_evm_acc(seed) {
    let mnemonicWallet = ethers.Wallet.fromMnemonic(seed);
    return mnemonicWallet;
}

function get_root_wallet() {
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
    const pair = keyring.addFromUri(process.env.ROOT, { name: 'key pair' }, 'sr25519');
    return pair;
}

async function funded_wallets() {

    let seeds = get_seeds();
    let key_pairs = get_wallets(seeds);

    let root = get_root_wallet();

    let provider = new WsProvider(process.env.WSS);
    const api = await ApiPromise.create({ provider });

    for (const key of key_pairs) {

        const txExecute = api.tx.balances.transfer(
            key.address,
            "10000000000000000000000"
        );
        await txExecute.signAndSend(root, { nonce: -1 });

        console.log("funded: ", key.address);
    }
}

module.exports = {
    funded_wallets,
    get_wallets,
    get_seeds,
    get_evm_acc
}