pragma solidity ^0.8.0;

import './KopiToken.sol';
import './SingaCoin.sol';

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;

    SingaCoin public singaCoin;
    KopiToken public kopiToken;

    address[] public stakerAddresses;

    mapping(address => uint) public stakingBalanceMap;
    mapping(address => bool) public hasStakedMap;
    mapping(address => bool) public isStakingMap; 

    constructor(SingaCoin _singaCoin, KopiToken _kopiToken) {
        singaCoin = _singaCoin;
        kopiToken = _kopiToken;
        owner = msg.sender;
    }

    
    function depositStableTokens(uint _amount) public {

        require(_amount > 0, "Staking amount has to be greater than 0!");

        // transferring SingaCoin to this DecentralBank contract
        singaCoin.transferFrom(msg.sender, address(this), _amount);

        // update staking balance
        stakingBalanceMap[msg.sender] = stakingBalanceMap[msg.sender] + _amount;

        if (!hasStakedMap[msg.sender]) {

            stakerAddresses.push(msg.sender);
        }

        hasStakedMap[msg.sender] = true;
        isStakingMap[msg.sender] = true;


    }

    // issue rewards
    function issueRewardTokens() public {
        // only owner can issue tokens
        require(msg.sender == owner, "You have to be the owner of the contract to call this function!");

        for(uint i=0; i < stakerAddresses.length; i++) {
            address recipient = stakerAddresses[i];
            uint rewardAmount = stakingBalanceMap[recipient] / 10;

            if (rewardAmount > 0) {
                kopiToken.transfer(recipient, rewardAmount);
            }
        }
    }

    function unstakeTokens(uint _amount) public {

        uint balance = stakingBalanceMap[msg.sender];

        require(_amount > 0, "Balance to unstake has to be greater than 0!");

        // transfer the staked from our bank to the caller's wallet
        singaCoin.transfer(msg.sender, balance);

        // update staking balance of caller
        stakingBalanceMap[msg.sender] = stakingBalanceMap[msg.sender] - _amount;

        if (stakingBalanceMap[msg.sender] == 0) {
            isStakingMap[msg.sender] = false;
        }
        
    }

    



}