
const { mnemonicGenerate } = require('@polkadot/util-crypto');
const fs = require('fs');
const { Keyring } = require('@polkadot/keyring');
const { ApiPromise, WsProvider } = require('@polkadot/api');

function get_wallets() {
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });

    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(process.env.WALLETS_PATH)
    });

    let key_pairs = [];

    lineReader.on('line', function (mnemonic) {
        const pair = keyring.addFromUri(mnemonic, { name: 'key pair' }, 'sr25519');
        key_pairs.push(pair);
    });
    return key_pairs;
}

function get_root_wallet() {
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });
    const pair = keyring.addFromUri(process.env.ROOT, { name: 'key pair' }, 'sr25519');
    return pair;
}

async function funded_wallets() {

    let key_pairs = get_wallets();

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
    funded_wallets
}