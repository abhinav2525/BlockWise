const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Blockwise contract", function () {
  let Blockwise, blockwise, owner, addr1, addr2, addr3, addrs;

  beforeEach(async function () {
    Blockwise = await ethers.getContractFactory("Blockwise");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();
    blockwise = await Blockwise.deploy();
    await blockwise.deployed();
  });

  it("Should allow users to add their name", async function () {
    await blockwise.connect(addr1).addName("Alice");
    const nameObject = await blockwise.getMyName(addr1.address);
    expect(nameObject.name).to.equal("Alice");
    expect(nameObject.hasName).to.be.true;
  });

  it("Create Group Request", async function () {
    await blockwise.connect(addr1).addName("Alice");
    await blockwise.connect(addr2).addName("Bob");
    await blockwise.connect(addr3).addName("Charlie");

    const totalAmount = ethers.utils.parseEther("1.0"); // 1 ether
    const description = "Split payment for dinner";
    const participants = [addr1.address, addr2.address, addr3.address];

    await blockwise.connect(addr1).createGroupRequest(totalAmount, description, participants);

    // Fetch the contract's event filter
    const filter = blockwise.filters.GroupRequestCreated();

    // Query the contract's events by filter
    const events = await blockwise.queryFilter(filter);

    // Ensure an event was emitted
    expect(events.length).to.equal(1);

    // Ensure the event has the expected values
    const event = events[0];
    const requestIndex = event.args[1].toNumber();

    expect(requestIndex).to.be.at.least(0);
  });

  it("Should allow friends to accept a group request", async function () {
    await blockwise.connect(addr1).addName("Alice");
    await blockwise.connect(addr2).addName("Bob");

    const participants = [addr2.address];
    await blockwise.connect(addr1).createGroupRequest(100, "Dinner", participants);

    await blockwise.connect(addr2).acceptGroupRequest(addr1.address, 0);

    const groupRequests = await blockwise.userGroupRequests(addr1.address);
    expect(groupRequests[0].acceptances[addr2.address]).to.be.true;
    expect(groupRequests[0].numberOfAcceptances).to.equal(1);
  });

  it("Should reject creator's acceptance of the group request", async function () {
    await blockwise.connect(addr1).addName("Alice");
    await blockwise.connect(addr2).addName("Bob");

    const participants = [addr2.address];
    await blockwise.connect(addr1).createGroupRequest(100, "Dinner", participants);

    // Try to accept the group request as the creator (addr1)
    try {
      await blockwise.connect(addr1).acceptGroupRequest(addr1.address, 0);
      // Expecting the function to revert due to the requirement that the creator cannot accept the request
      expect.fail("Acceptance by the creator should have reverted");
    } catch (error) {
      // Ensure that the transaction reverted with an error
      expect(error.message).to.contain("revert");
    }

    // Ensure the acceptance status remains false and the numberOfAcceptances is still 0
    const groupRequests = await blockwise.userGroupRequests(addr1.address);
    expect(groupRequests[0].acceptances[addr1.address]).to.be.false;
    expect(groupRequests[0].numberOfAcceptances).to.equal(0);
  });

  // Add more test cases here...

});
