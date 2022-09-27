const { mnemonicGenerate } = require('@polkadot/util-crypto');
const fs = require('fs');
require('dotenv').config();

function write_wallets(count) {
    var logger = fs.createWriteStream(process.env.WALLETS_PATH, {
        flags: 'a' // 'a' means appending (old data will be preserved)
    });
    
    for (let i = 0; i < count; i++) {
        let mnemonic = mnemonicGenerate();

        if (i < count - 1 ) {
            logger.write(`${mnemonic}\n`);
        } else {
            logger.write(`${mnemonic}`);
        }
    }
    logger.end();
}

module.exports = {
    write_wallets
}
