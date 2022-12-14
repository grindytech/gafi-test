
const { Keyring } = require('@polkadot/keyring');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { get_seeds, get_evm_acc } = require('./funded_wallets');
const { u8aToHex } = require('@polkadot/util');

async function proof_address_mapping(api, account, evm_account) {

    let is_map = await api.query.proofAddressMapping.id32Mapping(account.address);

    if (is_map.toHuman() == null) {
        let signature;
        {
            const data = u8aToHex(account.publicKey, undefined, false);

            let message = `Bond Gafi Network account:${data}`;
            signature = await evm_account.signMessage(message);
        }
        const txExecute = api.tx.proofAddressMapping.bond(
            signature,
            evm_account.address,
            false
        );

        await txExecute.signAndSend(account);

        console.log(`SUCCESS: mapped ${account.address} <> ${evm_account.address}`);
    } else {
        console.log(`FAIL: already mapped ${account.address}`);
    }

}

async function map_addreses() {
    let seeds = await get_seeds();

    let provider = new WsProvider(process.env.WSS);
    let api = await ApiPromise.create({ provider });

    api.on("disconnected", () => {
        console.log("api disconnected");
    })

    for (let i = 0; i < seeds.length; i++) {
        try {
            await map_address(api, seeds[i], i);
        } catch (err) {
            console.log(err);
        }
    }
}

async function map_address(api, seed, index = 0) {
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });

    let acc = keyring.addFromUri(seed, { name: 'key pair' }, 'sr25519');

    let evm_acc = get_evm_acc(seed);

    await proof_address_mapping(api, acc, evm_acc);
    console.log("count: ", index);
}

async function join_pool(pool_id) {
    let provider = new WsProvider(process.env.WSS);
    const api = await ApiPromise.create({ provider });
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });

    let seeds = await get_seeds();

    for (let i = 0; i < seeds.length; i++) {
        let acc = keyring.addFromUri(seeds[i], { name: 'key pair' }, 'sr25519');
        const txExecute = api.tx.pool.join(
            pool_id
        );
        await txExecute.signAndSend(acc);
        console.log(`joined: ${i}`)
    }
}

async function leave_pool() {
    let provider = new WsProvider(process.env.WSS);
    const api = await ApiPromise.create({ provider });
    const keyring = new Keyring({ type: 'sr25519', ss58Format: 42 });

    let seeds = await get_seeds();

    for (let i = 0; i < seeds.length; i++) {
        let acc = keyring.addFromUri(seeds[i], { name: 'key pair' }, 'sr25519');
        const txExecute = api.tx.pool.leaveAll();
        await txExecute.signAndSend(acc);
        console.log(`leaved: ${i}`)
    }
}

module.exports = {
    map_addreses,
    map_address,
    join_pool,
    leave_pool
}

