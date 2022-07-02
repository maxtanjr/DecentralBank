const SingaCoin = artifacts.require('SingaCoin.sol');
const KopiToken = artifacts.require('KopiToken.sol');
const DecentralBank = artifacts.require('DecentralBank.sol');

require('chai')
.use(require('chai-as-promised'))
.should()

contract('DecentralBank', ([owner, investor]) => {

    let singaCoin, kopiToken, decentralBank

    let convertTokensToWei = (numTokens) => {
        return web3.utils.toWei(numTokens, 'ether');
    }

    // any code we add to 'before' will run first, before the tests
    before(async() => {
        // Load contracts
        singaCoin = await SingaCoin.new();
        kopiToken = await KopiToken.new();
        decentralBank = await DecentralBank.new(singaCoin.address, kopiToken.address);

        // transfer all our reward tokens to the DecentralBank (1 million tokens, converted to wei)
        await kopiToken.transfer(decentralBank.address, convertTokensToWei('1000000'))

        // transfer 100 mock stablecoins to investor
        await singaCoin.transfer(investor, convertTokensToWei('100'))
    })

    describe('SingaCoin Deployment', async() => {
        it('matches name successfully', async() => {
            const name = await singaCoin.name();
            assert.equal(name, 'SingaCoin');
        })
    })

    describe('KopiToken Deployment', async() => {
        it('matches symbol successfully', async() => {
            const symbol = await kopiToken.symbol();
            assert.equal(symbol, 'KOPI');
        })
    })

    describe('Decentral Bank Deployment', async() => {
        it('matches name successfully', async() => {
            const name = await decentralBank.name();
            assert.equal(name, 'Decentral Bank');
        })

        it('supply of reward tokens match', async() => {
            let balance = await kopiToken.balanceOf(decentralBank.address);
            assert.equal(balance, convertTokensToWei('1000000'));
        })

        it('investor receives 100 stable coins', async() => {
            let balance = await singaCoin.balanceOf(investor);
            assert.equal(balance, convertTokensToWei('100'));
        })
    })

    describe('Yield farming', async() => {
        it('Reward tokens for staking', async() => {
            // Check investor balance
            let result = await singaCoin.balanceOf(investor);
            // not staked yet, so they should have 100 stable coins available to stake
            assert.equal(result, convertTokensToWei('100'), "Investor mock wallet balance before staking");
        })

        it('Issue staking rewards successfully', async() => {
            
            await decentralBank.issueRewardTokens({from:owner});

            await decentralBank.issueRewardTokens({from:investor}).should.be.rejected;
        })

        

        it('Balance of investor after staking is correct', async() => {
            // investor to approve decentralBank contract to spend 40 singaCoin in investor's wallet
            await singaCoin.approve(decentralBank.address, convertTokensToWei('40'), {from: investor})
            // investor will act as msg.sender when calling this function
            await decentralBank.depositStableTokens(convertTokensToWei('40'), {from: investor});

            // check updated balance of customer
            let balance = await singaCoin.balanceOf(investor);
            assert.equal(balance.toString(), convertTokensToWei('60'), "Investor mock wallet balance after testing");

            // check updated balance of Decentral Bank
            let bankBalance = await singaCoin.balanceOf(decentralBank.address);
            assert.equal(bankBalance.toString(), convertTokensToWei('40'), "Bank's Singa Coin balance is 40");

            // is staking balance
            let result = await decentralBank.isStakingMap(investor);
            assert.equal(result.toString(), 'true', 'customer is staking!');

            // unstake tokens
            await decentralBank.unstakeTokens(convertTokensToWei('40'), {from: investor});

            result = await singaCoin.balanceOf(investor);
            assert.equal(result.toString(), convertTokensToWei('100'), 'Customer has balance of: '+ convertTokensToWei('100') + 'Singa tokens');

            // check updated balance of decentral bank
            result = await singaCoin.balanceOf(decentralBank.address);
            assert.equal(result.toString(), convertTokensToWei('0'), "Decentral bank has 0 balance");

        })
        
    })
    
});