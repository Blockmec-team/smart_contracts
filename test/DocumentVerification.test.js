// test/DocumentVerification.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DocumentVerification", function () {
  let DocumentVerification;
  let documentVerification;
  let owner;
  let verifier;
  let user;

  beforeEach(async function () {
    [owner, verifier, user] = await ethers.getSigners();

    DocumentVerification = await ethers.getContractFactory("DocumentVerification");
    documentVerification = await DocumentVerification.deploy();
  });

  it("Should upload a new document", async function () {
    const documentHash = "0x1234567890abcdef";
    const metadata = "Document metadata";

    await documentVerification.connect(user).uploadDocument(documentHash, metadata);

    const documentId = ethers.solidityPackedKeccak256(["address", "string"], [user.address, documentHash]);
    const document = await documentVerification.getDocument(documentId);
    expect(document.owner).to.equal(user.address);
    expect(document.documentHash).to.equal(documentHash);
    expect(document.verified).to.equal(false);
    expect(document.metadata).to.equal(metadata);
  });

  it("Should grant access to verify a document", async function () {
    const documentHash = "0x1234567890abcdef";
    const metadata = "Document metadata";

    await documentVerification.connect(user).uploadDocument(documentHash, metadata);

    const documentId = ethers.solidityPackedKeccak256(["address", "string"], [user.address, documentHash]);
    await documentVerification.connect(user).grantAccess(documentId, verifier.address);

    const verifierAddress = await documentVerification.documentAccess[documentId];
    expect(verifierAddress).to.equal(verifier.address);
  });

  it("Should verify a document", async function () {
    const documentHash = "0x1234567890abcdef";
    const metadata = "Document metadata";

    await documentVerification.connect(user).uploadDocument(documentHash, metadata);

    const documentId = ethers.solidityPackedKeccak256(["address", "string"], [user.address, documentHash]);
    await documentVerification.connect(user).grantAccess(documentId, verifier.address);

    await documentVerification.connect(verifier).verifyDocument(documentId);

    const document = await documentVerification.getDocument(documentId);
    expect(document.verified).to.equal(true);
  });

  it("Should revert when trying to verify a document without access", async function () {
    const documentHash = "0x1234567890abcdef";
    const metadata = "Document metadata";

    await documentVerification.connect(user).uploadDocument(documentHash, metadata);

    const documentId = ethers.solidityPackedKeccak256(["address", "string"], [user.address, documentHash]);
    
    await expect(documentVerification.connect(verifier).verifyDocument(documentId)).to.be.revertedWith("You are not authorized to verify this document");
  });
});
