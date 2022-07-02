const SingaCoin = artifacts.require('SingaCoin.sol');
const KopiToken = artifacts.require('KopiToken.sol');
const DecentralBank = artifacts.require('DecentralBank.sol');

module.exports = async (deployer, network, accounts) => {
    // deploy our stablecoin contract
    await deployer.deploy(SingaCoin);
    const singaCoin = await SingaCoin.deployed();

    // deploy our reward token contract
    await deployer.deploy(KopiToken);
    const kopiToken = await KopiToken.deployed();

    // deploy our DecentralBank contract, which takes in 2 arguments in its constructor
    await deployer.deploy(DecentralBank, singaCoin.address, kopiToken.address);
    const decentralBank = await DecentralBank.deployed();

    // move all our reward tokens to our Bank on deployment
    await kopiToken.transfer(decentralBank.address, '1000000000000000000000000');

    // distribute 100 SingaCoin tokens to one investor (2nd address in truffle)
    await singaCoin.transfer(accounts[1], '100000000000000000000');

};