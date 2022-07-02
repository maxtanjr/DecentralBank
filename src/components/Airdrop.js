import React, { useEffect, useState } from 'react'

import DecentralBank from '../truffle_abis/DecentralBank.json';

// to have a timer that counts down. Initialize countdown after our customers have staked
const Airdrop = (props) => {

    const decentralBankContract = props.decentralBankContract;


    const [time, setTime] = useState(null);
    const [seconds, setSeconds] = useState(20);
    
    const stakingBalance = props.stakingBalance;

    const countDown = () => {
        // countdown one second at a time
        let s, timeLeft;

        if (seconds > 0) {
            s = seconds - 1;

            timeLeft = getTimeFromEpoch(s);

            setTime(timeLeft);
            setSeconds(s);
        }

        releaseAirdrop();
    }

    const releaseAirdrop = async() => {
        if (seconds === 0) {
            if (stakingBalance >= window.web3.utils.toWei('1', 'Ether')) {

                // call issueRewardTokens from DecentralBank contract here
                

                console.log("Airdrop sent!");
            }
            setSeconds(20);
            setTime(getTimeFromEpoch(seconds));
        }
    }


    const getTimeFromEpoch = (secs) => {
        let days, hours, minutes, seconds;

        days = Math.floor(secs / (24 * 3600));

        let remainderForHours = secs % (24 * 3600);

        hours = Math.floor(remainderForHours / 3600);

        let remainderForMinutes = secs % 3600;

        minutes = Math.floor(remainderForMinutes / 60);

        seconds = Math.ceil(remainderForMinutes % 60);
            
        let object = {
            'd': days,
            'h': hours,
            'm': minutes,
            's': seconds,
        }

        return object;
    }

    useEffect(() => {
        let interval = setInterval(() => countDown(), (1000 * 1))

        return () => {
            clearInterval(interval);
        }

    }, [seconds])


    if (time != null ) {
        return (
            <div style={{color:"black"}}>
                {time.d} Days {time.h} Hours {time.m} Minutes {time.s} Seconds
            </div>
        )
    } else {
        return null;
    }
    
    

}

export default Airdrop;