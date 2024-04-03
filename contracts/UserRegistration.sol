// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UserRegistration {
    // Struct to represent user account data
    struct User {
        uint256 userId;
        string username;
        address userAddress;
        string email;
        string firstName;
        string lastName;
        uint256 phoneNumber;
    }

    // Mapping to store user accounts
    mapping(uint256 => User) public users;

    // Variable to track the current user ID
    uint256 private currentUserId;

    // Event emitted upon successful registration
    event Registered(
        uint256 userId,
        string username,
        address userAddress,
        string email,
        string firstName,
        string lastName,
        uint256 phoneNumber
    );

    // Function to register a new user
    function register(
        string memory _username,
        string memory _email,
        string memory _firstName,
        string memory _lastName,
        uint256 _phoneNumber
    ) external {
        currentUserId++;
        users[currentUserId] = User({
            userId: currentUserId,
            username: _username,
            userAddress: msg.sender,
            email: _email,
            firstName: _firstName,
            lastName: _lastName,
            phoneNumber: _phoneNumber
        });

        emit Registered(
            currentUserId,
            _username,
            msg.sender,
            _email,
            _firstName,
            _lastName,
            _phoneNumber
        );
    }

    // Function to get user details by user ID
    function getUser(uint256 _userId) external view returns (
        uint256 userId,
        string memory username,
        address userAddress,
        string memory email,
        string memory firstName,
        string memory lastName,
        uint256 phoneNumber
    ) {
        require(_userId <= currentUserId, "User does not exist");
        User memory user = users[_userId];
        return (
            user.userId,
            user.username,
            user.userAddress,
            user.email,
            user.firstName,
            user.lastName,
            user.phoneNumber
        );
    }
}
