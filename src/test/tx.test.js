var chai = require('chai');
var expect = chai.expect;
require('dotenv').config();
const { ApiPromise, WsProvider } = require('@polkadot/api');
let Web3 = require('web3');

const { create_token } = require("../tx/tx");
const { get_evm_acc } = require('../wallet/funded_wallets');
const { map_address } = require('../wallet/wallet');

describe('Transaction', async () => {
    beforeEach((done) => {
        //Before each test we empty the database in your case
        done();
    });

    it('create gafi token should work', async () => {
        let provider = new WsProvider(process.env.WSS);
        let api = await ApiPromise.create({ provider });

        let seed = process.env.ROOT;
        
        let evm_acc = get_evm_acc(seed);

        await map_address(api, seed);

        let web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider(process.env.RPC));
        await create_token(web3, evm_acc);
    })
})

