// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IdentityContract {
    // Struct to represent user identity data
    struct Identity {
        bool isRegistered;
        bool isVerified;
        address userAddress;
        string firstName;
        string lastName;
        string documentHash; // Hash of the uploaded document stored on IPFS or similar
    }

    // Mapping to store user identities
    mapping(address => Identity) public identities;

    // Administrator address
    address public adminAddress;

    // Event emitted upon successful registration
    event Registered(address indexed user, string firstName, string lastName);

    // Modifier to restrict access to registered users only
    modifier onlyRegistered() {
        require(identities[msg.sender].isRegistered, "User is not registered");
        _;
    }

    // Modifier to restrict access to the administrator only
    modifier onlyAdmin() {
        require(msg.sender == adminAddress, "Only admin can perform this operation");
        _;
    }

    // Constructor to set the administrator address
    constructor() {
        adminAddress = msg.sender;
    }

    // Function to register a new user
    function register(string memory _firstName, string memory _lastName) external {
        require(!identities[msg.sender].isRegistered, "User is already registered");

        identities[msg.sender] = Identity({
            isRegistered: true,
            isVerified: false,
            userAddress: msg.sender,
            firstName: _firstName,
            lastName: _lastName,
            documentHash: ""
        });

        emit Registered(msg.sender, _firstName, _lastName);
    }

    // Function to submit document hash
    function submitDocumentHash(string memory _documentHash) external onlyRegistered {
        require(!identities[msg.sender].isVerified, "User is already verified");
        identities[msg.sender].documentHash = _documentHash;
    }

    // Function to verify user identity
    function verifyIdentity(address _userAddress) external onlyAdmin {
        require(identities[_userAddress].isRegistered, "User is not registered");
        require(!identities[_userAddress].isVerified, "User is already verified");

        identities[_userAddress].isVerified = true;
    }

    // Function to get user identity data
    function getIdentity(address _userAddress) external view returns (
        bool isRegistered,
        bool isVerified,
        address userAddress,
        string memory firstName,
        string memory lastName,
        string memory documentHash
    ) {
        Identity memory identity = identities[_userAddress];
        return (
            identity.isRegistered,
            identity.isVerified,
            identity.userAddress,
            identity.firstName,
            identity.lastName,
            identity.documentHash
        );
    }
}
