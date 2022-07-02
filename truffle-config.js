require('babel-register');
require('babel-polyfill');

module.exports = {
    networks: {
        development: {
            host: '127.0.0.1',
            port: '8545',
            network_id: '*' // connects to any network
        },
    },
    contracts_directory: './src/contracts/',
    contracts_build_directory: './src/truffle_abis',    // where the ABIs of our solidity SCs are stored
    compilers: {
        solc: {
            version:'^0.8.0',
            optimizer: {
                enabled:true,
                runs:200
            },
        }
    }
}