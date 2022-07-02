import React, { useState, useEffect, Fragment } from 'react';
import './css/App.css';
import Navbar from './Navbar';
import Web3 from 'web3';

import SingaCoin from '../truffle_abis/SingaCoin.json';
import KopiToken from '../truffle_abis/KopiToken.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';

import Main from './Main.js';


const App = () => {

    // check for wallet to authenticate to website
    const loadWeb3 = async() => {
        if(window.ethereum) {
            // using ethereum provider if found
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            // whatever the current provider is, go with it
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('No Web3 wallet found, you may check out MetaMask')
        }
    }

    // state variables
    const [account, setAccount] = useState("");
    const [singaCoinContract, setSingaCoinContract] = useState(null);
    const [kopiTokenContract, setKopiTokenContract] = useState(null);
    const [decentralBankContract, setDecentralBankContract] = useState(null);

    const [singaCoinBalance, setSingaCoinBalance] = useState('0');
    const [kopiTokenBalance, setKopiTokenBalance] = useState('0');
    const [stakingBalance, setStakingBalance] = useState('0');

    const [isLoading, setIsLoading] = useState(true);

    const stakeTokens = (amount) => {
        setIsLoading(true);
        // prompt user to allow DecentralBank to spend his/her SingaCoin tokens
        singaCoinContract.methods.approve(decentralBankContract._address, amount).send({from:account}).on('transactionHash', (hash) => {
            console.log("Transaction hash: ", hash);
            setIsLoading(false);
        });
        // render the loading page until we receive a transactionHash event
        decentralBankContract.methods.depositStableTokens(amount).send({from:account}).on('transactionHash', (hash) => {
            console.log("Transaction hash: ", hash);
            setIsLoading(false);
        });
        
    }

    const unstakeTokens = () => {
        setIsLoading(true);

        decentralBankContract.methods.unstakeTokens(stakingBalance).send({from:account}).on('transactionHash', (hash) => {
            console.log("Transaction hash: ", hash);
            setIsLoading(false);
        });
    }


    
    const loadBlockchainData = async() => {
        const web3 = window.web3;

        // attempt to get user's account
        const walletAddresses = await web3.eth.getAccounts();
        const walletAddress = walletAddresses[0]; 

        console.log("Connected wallet address: ", walletAddress);

        // set wallet address in state
        setAccount(walletAddress);

        // get the network before deploying our contracts
        const networkId = await web3.eth.net.getId();
        console.log("Network ID: ", networkId);

        // Load stablecoin contract and set it in state
        const singaCoinMetaData = SingaCoin.networks[networkId];
        if (singaCoinMetaData) {
            const singaCoin = new web3.eth.Contract(SingaCoin.abi, singaCoinMetaData.address);
            setSingaCoinContract(singaCoin);

            // balance will change
            let balance = await singaCoin.methods.balanceOf(walletAddress).call();
            setSingaCoinBalance(balance.toString());

            console.log("SingaCoin balance: ", singaCoinBalance);
        } else {
            window.alert('SingaCoin contract not deployed -- no suitable network detected!');
        }

        // load KopiToken contract
        const kopiTokenMetaData = KopiToken.networks[networkId];
        if (kopiTokenMetaData) {
            const kopiToken = new web3.eth.Contract(KopiToken.abi, kopiTokenMetaData.address);
            setKopiTokenContract(kopiToken);

            let balance = await kopiToken.methods.balanceOf(walletAddress).call();
            setKopiTokenBalance(balance.toString());
            console.log("Kopi Token Balance: ", kopiTokenBalance);
        } else {
            window.alert('KopiToken contract not deployed -- no suitable network detected!');
        }

        const decentraBankMetaData = DecentralBank.networks[networkId];
        if (decentraBankMetaData) {
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentraBankMetaData.address);
            setDecentralBankContract(decentralBank);

            // console.log(decentralBank._address)

            let balance = await decentralBank.methods.stakingBalanceMap(walletAddress).call();
            setStakingBalance(balance.toString());

            console.log("Current number of SingaCoin tokens staked in Bank: ", stakingBalance);
        } else {
            window.alert('KopiToken contract not deployed -- no suitable network detected!');
        }

        setIsLoading(false);

    }

    useEffect(() => {
        loadWeb3();
        loadBlockchainData();

    }, [account, singaCoinBalance, kopiTokenBalance, stakingBalance])


    return (
        <Fragment>
            <div className='App' style={{position:"relative"}}>

                <div className='d-flex' style={{flexDirection:"column"}}>
                    <Navbar 
                        account={account}
                    />

                    <div className='d-flex' style={{flexDirection:'column', width: "800px", marginTop:'60px', marginRight:'auto', marginLeft:'auto',
                                                    maxWidth:'100%', maxHeight:'100vm'}}>    
                        {!isLoading
                            ? <Main 
                                singaCoinBalance={singaCoinBalance}
                                kopiTokenBalance={kopiTokenBalance}
                                stakingBalance={stakingBalance}
                                stakeTokens={stakeTokens}
                                unstakeTokens={unstakeTokens}
                                decentralBankContract={decentralBankContract}
                            />
                            : <div className="d-flex" style={{flexDirection:"space-between", alignItems:"center"}}>Loading... Please wait</div>
                        }
                    
                    </div>
                </div>
            </div>
            
        </Fragment>
        
    )
}

export default App;