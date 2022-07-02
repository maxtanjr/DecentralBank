// dont need to type out the whole path for Migrations.sol, because our truffle config has defined where
// our contracts directory is
const Migrations = artifacts.require('Migrations');

module.exports = (deployer) => {
    deployer.deploy(Migrations);
}