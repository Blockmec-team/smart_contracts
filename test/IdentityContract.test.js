// test/IdentityContract.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IdentityContract", function () {
  let IdentityContract;
  let identityContract;
  let owner;
  let user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    IdentityContract = await ethers.getContractFactory("IdentityContract");
    identityContract = await IdentityContract.deploy();
    await identityContract.deployed();
  });

  it("Should register a new user", async function () {
    await identityContract.connect(user).register("John", "Doe");

    const userIdentity = await identityContract.getIdentity(user.address);
    expect(userIdentity.isRegistered).to.be.true;
    expect(userIdentity.isVerified).to.be.false;
    expect(userIdentity.firstName).to.equal("John");
    expect(userIdentity.lastName).to.equal("Doe");
  });

  it("Should submit document hash", async function () {
    await identityContract.connect(user).register("John", "Doe");
    const documentHash = "0x123456...";
    await identityContract.connect(user).submitDocumentHash(documentHash);

    const userIdentity = await identityContract.getIdentity(user.address);
    expect(userIdentity.documentHash).to.equal(documentHash);
  });

  it("Should verify user identity", async function () {
    await identityContract.connect(user).register("John", "Doe");
    await identityContract.connect(owner).verifyIdentity(user.address);

    const userIdentity = await identityContract.getIdentity(user.address);
    expect(userIdentity.isVerified).to.be.true;
  });

  it("Should only allow admin to verify user identity", async function () {
    await identityContract.connect(user).register("John", "Doe");
    
    // Attempt to verify identity as user, should revert
    await expect(identityContract.connect(user).verifyIdentity(user.address)).to.be.revertedWith("Only admin can perform this operation");
  });
});
