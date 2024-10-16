
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract TokenRewards is ERC20, Ownable, Pausable {
    mapping(address => bool) public instructors;
    uint256 public constant REWARD_AMOUNT = 10 * 10**18; // 10 tokens
    uint256 public constant MAX_SUPPLY = 1000000 * 10**18; // 1 million tokens

    event InstructorAdded(address instructor);
    event InstructorRemoved(address instructor);
    event RewardIssued(address student, uint256 amount);

    constructor() ERC20("DecentralLearn Token", "DLT") {
        _mint(msg.sender, 100000 * 10**18); // Mint 100,000 tokens to the contract deployer
    }

    modifier onlyInstructor() {
        require(instructors[msg.sender], "Caller is not an instructor");
        _;
    }

    function addInstructor(address _instructor) external onlyOwner {
        instructors[_instructor] = true;
        emit InstructorAdded(_instructor);
    }

    function removeInstructor(address _instructor) external onlyOwner {
        instructors[_instructor] = false;
        emit InstructorRemoved(_instructor);
    }

    function issueReward(address _student) external onlyInstructor whenNotPaused {
        require(totalSupply() + REWARD_AMOUNT <= MAX_SUPPLY, "Max supply reached");
        _mint(_student, REWARD_AMOUNT);
        emit RewardIssued(_student, REWARD_AMOUNT);
    }

    function burnTokens(uint256 _amount) external {
        _burn(msg.sender, _amount);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Override transfer function to check for paused state
    function transfer(address recipient, uint256 amount) public virtual override whenNotPaused returns (bool) {
        return super.transfer(recipient, amount);
    }

    // Override transferFrom function to check for paused state
    function transferFrom(address sender, address recipient, uint256 amount) public virtual override whenNotPaused returns (bool) {
        return super.transferFrom(sender, recipient, amount);
    }
}