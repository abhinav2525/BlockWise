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
    const totalAmount = ethers.utils.parseEther("1.0"); // 1 ether
    const description = "Split payment for dinner";
    const participants = [addr1.address, addr2.address, addr3.address];

    await blockwise.connect(owner).createGroupRequest(totalAmount, description, participants);
    
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
//  it("Create Group Request", async function () {
//     const totalAmount = ethers.utils.parseEther("1.0"); // 1 ether
//     const description = "Split payment for dinner";
//     const participants = [addr1.address, addr2.address, addr3.address];

//     const tx = await blockwise.connect(owner).createGroupRequest(totalAmount, description, participants);

//     await expect(tx).to.emit(blockwise, "GroupRequestCreated")
//     .then((event) => {
//       console.log({event})
//       const idx = event.args[1];
//       console.log({idx})
//     }).catch(e => {
//       console.log({error: e})
//     })

    // const receipt = await tx.wait();
    // const requestIndex = receipt.events ? receipt.events[0].args[0].toNumber() : 0;

    // expect(requestIndex).to.be.at.least(0);

    // Since mappings cannot be read directly in Solidity, we might need additional getter methods in the contract
    // to test the values set in the GroupRequest.
  // });
  // it("Should allow users to create a group request", async function () {
  //   await blockwise.connect(addr1).addName("Alice");
  //   await blockwise.connect(addr2).addName("Bob");

  //   const participants = [addr1.address, addr2.address];
  //   await blockwise.connect(addr1).createGroupRequest(100, "Dinner", participants);

  //   const groupRequests = await blockwise.userGroupRequests(addr1.address);
  //   expect(groupRequests[0].totalAmount).to.equal(100);
  //   expect(groupRequests[0].active).to.be.true;
  //   expect(groupRequests[0].description).to.equal("Group request by Alice: Dinner");
  //   expect(groupRequests[0].participants[0]).to.equal(addr2.address);
  // });

  

  it("Should allow friends to accept a group request", async function () {
    await blockwise.connect(addr1).addName("Alice");
    await blockwise.connect(addr2).addName("Bob");

    const participants = [addr2.address];
    await blockwise.connect(addr1).createGroupRequest(100, "Dinner", participants);

    await blockwise.connect(addr2).acceptGroupRequest(0);

    const groupRequests = await blockwise.userGroupRequests(addr1.address);
    expect(groupRequests[0].acceptances[addr2.address]).to.be.true;
    expect(groupRequests[0].numberOfAcceptances).to.equal(1);
  });
});
