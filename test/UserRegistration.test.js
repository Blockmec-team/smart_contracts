// test/UserRegistration.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UserRegistration", function () {
  let UserRegistration;
  let userRegistration;
  let owner;
  let user;

  beforeEach(async function () {
    [owner, user] = await ethers.getSigners();

    UserRegistration = await ethers.getContractFactory("UserRegistration");
    userRegistration = await UserRegistration.deploy();
  });

  it("Should register a new user", async function () {
    const username = "JohnDoe";
    const email = "john.doe@example.com";
    const firstName = "John";
    const lastName = "Doe";
    const phoneNumber = 1234567890;

    await userRegistration.connect(user).register(
      username,
      email,
      firstName,
      lastName,
      phoneNumber
    );

    const userInfo = await userRegistration.getUser(1);
    expect(userInfo.userId).to.equal(1);
    expect(userInfo.username).to.equal(username);
    expect(userInfo.userAddress).to.equal(user.address);
    expect(userInfo.email).to.equal(email);
    expect(userInfo.firstName).to.equal(firstName);
    expect(userInfo.lastName).to.equal(lastName);
    expect(userInfo.phoneNumber).to.equal(phoneNumber);
  });

  it("Should retrieve user details", async function () {
    const username = "JaneDoe";
    const email = "jane.doe@example.com";
    const firstName = "Jane";
    const lastName = "Doe";
    const phoneNumber = 9876543210;

    await userRegistration.connect(user).register(
      username,
      email,
      firstName,
      lastName,
      phoneNumber
    );

    const userInfo = await userRegistration.getUser(1);
    expect(userInfo.userId).to.equal(1);
    expect(userInfo.username).to.equal(username);
    expect(userInfo.userAddress).to.equal(user.address);
    expect(userInfo.email).to.equal(email);
    expect(userInfo.firstName).to.equal(firstName);
    expect(userInfo.lastName).to.equal(lastName);
    expect(userInfo.phoneNumber).to.equal(phoneNumber);
  });

  it("Should revert when trying to retrieve non-existent user", async function () {
    await expect(userRegistration.getUser(100)).to.be.revertedWith("User does not exist");
  });
});
