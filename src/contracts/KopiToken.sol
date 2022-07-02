pragma solidity ^0.8.0;

contract KopiToken {
    string public name = 'Kopi Token';
    string public symbol = 'KOPI';
    uint256 public totalSupply = 1_000_000_000_000_000_000_000_000; // 1 million tokens
    uint8 public decimals = 18;

    event Transfer(
        address indexed _from,  // indexed allows users to filter through the addresses
        address indexed _to,
        uint _value
    );

    event Approval(
        address indexed _owner, // approval should come from the owner anyways
        address indexed _spender,
        uint _value
    );

    // map of SGDC balances for each address
    mapping(address => uint256) public balanceOf;
    // allow us to keep track (with iterations) for our allowance
    mapping(address => mapping(address => uint256)) public allowance;

    constructor() {
        // balance of the deployer on deployment, should be set to the total supply
        // msg.sender on deployment is the owner anyways
        balanceOf[msg.sender] = totalSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool isSuccess) {
        // first, reduce the balance of the person that called this function first, 
        // for check-effects interaction
        require(balanceOf[msg.sender] >= _value, 'You do not have enough tokens for this txn!');
        balanceOf[msg.sender] -= _value;
        // attempt to transfer the token balance to the recipient
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;

    }

    function approve(address _spender, uint256 _value) public returns (bool isSuccess) {
        // the spender is the one that we want to be approving. 
        // Imagine you are the one that calls this function. The spender is the third party
        // you are allowing to spend on your behalf. This sets how much they can withdraw on your behalf
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    // With the Approval by the owner, 3rd parties can run transactions 
    // (egs. pay for gas fees, do transfers on behalf, etc)
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool isSuccess) {
        // require that the token balance for the _from address is greater 
        require(balanceOf[_from] >= _value, 'The sender does not have enough tokens for this txn!');
        
        // Look at the approve function above. Now, the third party is the msg.sender. 
        // _from is the wallet that approved this transaction. This checks if the value approved above
        // is greater than what is requested here. If so, allow it
        require(allowance[_from][msg.sender] >= _value, 'The total value requested is less than the approved value');
        // if ok, deduct balance from the allowance mapping
        allowance[_from][msg.sender] -= _value;

        // add balance for recipient
        balanceOf[_to] += _value;

        emit Transfer(_from, _to, _value);

        return true;
    }


}