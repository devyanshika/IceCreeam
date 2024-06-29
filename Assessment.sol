// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 public iceCreamPrice;

    event Deposit(address indexed account, uint256 amount);
    event Withdraw(address indexed account, uint256 amount);
    event IceCreamBought(address indexed buyer, uint256 price);
    event IceCreamPriceSet(uint256 price);

    constructor(uint256 initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit() public payable {
        balance += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(balance >= _withdrawAmount, "Insufficient balance");
        
        balance -= _withdrawAmount;
        payable(msg.sender).transfer(_withdrawAmount);
        emit Withdraw(msg.sender, _withdrawAmount);
    }

    function setIceCreamPrice(uint256 _price) public {
        require(msg.sender == owner, "You are not the owner of this account");
        iceCreamPrice = _price;
        emit IceCreamPriceSet(_price);
    }

    function getIceCreamPrice() public view returns (uint256) {
        return iceCreamPrice;
    }

    function buyIceCream() public payable {
        require(msg.value == iceCreamPrice, "Incorrect payment amount");
        require(balance >= iceCreamPrice, "Contract balance is insufficient");

        balance -= iceCreamPrice;
        emit IceCreamBought(msg.sender, iceCreamPrice);
    }

    receive() external payable {
        // Handle incoming Ether, if necessary
    }
}
