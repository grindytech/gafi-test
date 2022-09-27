var chai = require('chai');
var expect = chai.expect;

const { get_evm_acc, get_seeds, get_wallets } = require("../wallet/funded_wallets");

describe('Whitelist', async () => {
    beforeEach((done) => {
        //Before each test we empty the database in your case
        done();
    });

    it('should get get_evm_addresses', function (done) {
        let seed = "economy pudding brain review limb dragon bachelor guess employ afraid script boss";
        let address = get_evm_acc(seed).address;
        expect(address)
            .to.equal("0xE325A27b44190790fe5Ffd70A39f1C94BA7C6FCE");
        done();
    })


    it('get seeds work', async () => {
        let seeds = await get_seeds();
        expect(seeds.length)
            .to.equal(1000);
    })

    it('get wallets work', async () => {
        let seeds = await get_seeds();
        let wallets = await get_wallets(seeds);
        expect(wallets.length)
            .to.equal(1000);
    })
})