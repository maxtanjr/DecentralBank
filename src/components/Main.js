import React, { useState, useEffect, Fragment } from 'react'
import tether from '../tether.png';
import Airdrop from './Airdrop';

const Main = (props) => {

    let kopiTokenBalance = props.kopiTokenBalance;
    let singaCoinBalance = props.singaCoinBalance;
    let stakingBalance = props.stakingBalance;

    const [depositValueInput, setDepositValueInput] = useState(0);

    const handleInputChange = (evt) => {
        let value = evt.target.value;
        setDepositValueInput(value);
    }

    const withdrawTokensButtonEvent = (evt) => {
        props.unstakeTokens();
    }

    const formSubmitEvent = (evt) => {
        // prevent the risk of this function from being called repeatedly
        evt.preventDefault();
        // take the value set in the input of the form
        let amount = depositValueInput.toString();
        console.log(amount)
        amount = window.web3.utils.toWei(amount, 'Ether');
        props.stakeTokens(amount)
        
    }

    return(
        <Fragment>
            <div id="content" className="mt-3" style={{zIndex:"1"}}>
                <table className="table text-muted text-center">
                    <thead>
                        <tr style={{color:"black"}}>
                            <th scope="col">Staking Balance</th>
                            <th scope="col">Reward Balance</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr style={{color:"black"}}></tr>
                        <td>{window.web3.utils.fromWei(stakingBalance, 'Ether')} SGDC</td>
                        <td>{window.web3.utils.fromWei(kopiTokenBalance, 'Ether')} KOPI</td>
                    </tbody>
                </table>

                <div className='card mb-2' style={{opacity:".9"}}>
                    <form className='mb-3' onSubmit={formSubmitEvent}>
                        <div style={{borderSpacing:"0 1em"}}>
                            <label className='float-left' style={{marginLeft:"15px"}}>
                                <b>Stake Tokens</b>
                            </label>
                            <span className='float-right' style={{marginRight:"8px"}}>
                                <b>Balance: {window.web3.utils.fromWei(singaCoinBalance, 'Ether')}</b>
                            </span>
                            <div className='input-group mb-4'>

                                {/* input deposit */}
                                <input value={depositValueInput} onChange={handleInputChange} type='text' placeholder='0' required></input>

                                <div className='input-group-open'>
                                    <div className='input-group-text'>
                                        <img src={tether} style={{ height:"32px"}}/>
                                        <div className="d-flex" style={{alignItems:"center", marginLeft:"5px"}}>SGDC</div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className='btn btn-primary btn-lg btn-block'>DEPOSIT</button>
                        </div>
                    </form>

                    <button className='btn btn-primary btn-lg btn-block' onClick={withdrawTokensButtonEvent}>WITHDRAW</button>

                    <div className='card-body text-center' style={{color:"blue"}}>
                        AIRDROP 
                        <Airdrop 
                            stakingBalance={stakingBalance}
                            {...props}
                        />
                    </div>
                </div>

            </div>
        </Fragment>
    )

} 

export default Main;