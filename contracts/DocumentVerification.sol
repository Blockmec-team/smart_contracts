// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DocumentVerification {
    // Struct to represent document details
    struct Document {
        address owner;
        string documentHash;
        bool verified;
        string metadata; // Additional document metadata
    }

    // Mapping to store document details
    mapping(bytes32 => Document) private documents;

    // Mapping to store document access control
    mapping(bytes32 => address) private documentAccess;

    // Event emitted upon successful document upload
    event DocumentUploaded(address indexed owner, string documentHash);

    // Event emitted upon successful document verification
    event DocumentVerified(address indexed verifier, bytes32 documentId);

    // Modifier to ensure only document owner can perform certain operations
    modifier onlyOwner(bytes32 documentId) {
        require(documents[documentId].owner == msg.sender, "You are not the owner of this document");
        _;
    }

    // Modifier to ensure only document verifier can perform certain operations
    modifier onlyVerifier(bytes32 documentId) {
        require(documentAccess[documentId] == msg.sender, "You are not authorized to verify this document");
        _;
    }

    // Function to upload a new document
    function uploadDocument(string memory _documentHash, string memory _metadata) external {
        bytes32 documentId = keccak256(abi.encodePacked(msg.sender, _documentHash));
        require(documents[documentId].owner == address(0), "Document already exists");

        documents[documentId] = Document({
            owner: msg.sender,
            documentHash: _documentHash,
            verified: false,
            metadata: _metadata
        });

        emit DocumentUploaded(msg.sender, _documentHash);
    }

    // Function to verify a document
    function verifyDocument(bytes32 documentId) external onlyVerifier(documentId) {
        documents[documentId].verified = true;
        emit DocumentVerified(msg.sender, documentId);
    }

    // Function to get document details by document ID
    function getDocument(bytes32 documentId) external view returns (
        address owner,
        string memory documentHash,
        bool verified,
        string memory metadata
    ) {
        Document memory doc = documents[documentId];
        return (doc.owner, doc.documentHash, doc.verified, doc.metadata);
    }

    // Function to grant access to verify a document
    function grantAccess(bytes32 documentId, address verifier) external onlyOwner(documentId) {
        documentAccess[documentId] = verifier;
    }
    
}
