// script that we can run after the contract is deployed, whenever we want to execute an action (egs airdrop our stakers)

// Run the following command in the terminal:
// truffle exec scripts/issue_tokens.js 

const DecentralBank = artifacts.require('DecentralBank');

module.exports = async(callback)  => {
    let decentralBank = await DecentralBank.deployed();
    await decentralBank.issueRewardTokens()
    console.log("Tokens have been issued successfully!");
    // a callback function is a function that calls itself
    callback();
}