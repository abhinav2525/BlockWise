const express = require("express");
const Moralis = require("moralis").default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;
const ABI = require("./abi.json");

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("<h1> Hello from blockWise Backend APIs</h1>");
});


function transformMetaData(data) {
  let output = [];

  // Assuming all inner arrays are of the same length
  const length = data["0"].length;

  for(let i = 0; i < length; i++) {
    let item = {
      address: data["0"][i],
      name: data["1"][i],
      requestID: parseInt(data["2"][i], 10),
      description: data["3"][i],
      timestamp: data["4"][i]
    };
    output.push(item);
  }

  return output;
}


function convertArrayToObjects(arr) {
  const dataArray = arr.map((transaction, index) => ({
    key: (arr.length + 1 - index).toString(),
    type: transaction[0],
    amount: transaction[1],
    message: transaction[2],
    address: `${transaction[3].slice(0, 4)}...${transaction[3].slice(0, 4)}`,
    subject: transaction[4],
    time: transaction[5],
  }));

  return dataArray.reverse();
}

function transformData(input) {
  const names = input["0"];
  const addresses = input["1"];
  let output = [];

  for (let i = 0; i < names.length; i++) {
    output.push({
      name: names[i],
      address: addresses[i]
    });
  }

  return output;
}

app.get("/getNameAndBalance", async (req, res) => {
  const { userAddress } = req.query;

  const response = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: process.env.BLOCKWISE_ADDRESS,
    functionName: "getMyName",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseName = response.raw;

  const secResponse = await Moralis.EvmApi.balance.getNativeBalance({
    chain: "0x13881",
    address: userAddress,
  });

  const jsonResponseBal = (secResponse.raw.balance / 1e18).toFixed(2);

  const thirResponse = await Moralis.EvmApi.token.getTokenPrice({
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  });

  const jsonResponseDollars = (
    thirResponse.raw.usdPrice * jsonResponseBal
  ).toFixed(2);

  const fourResponse = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: process.env.BLOCKWISE_ADDRESS,
    functionName: "getMyHistory",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseHistory = convertArrayToObjects(fourResponse.raw);


  const fiveResponse = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: process.env.BLOCKWISE_ADDRESS,
    functionName: "getMyRequests",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseRequests = fiveResponse.raw;

  const sixResponse = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: process.env.BLOCKWISE_ADDRESS,
    functionName: "getAllFriends",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseFriends = transformData(sixResponse.raw)

  const sevenResponce = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: process.env.BLOCKWISE_ADDRESS,
    functionName:"getGroupRequestMetasIfParticipant",
    abi:ABI,
    params: {_user:userAddress},
  })

  const jsonResponceMeta = transformMetaData(sevenResponce.raw)

  const jsonResponse = {
    name: jsonResponseName,
    balance: jsonResponseBal,
    dollars: jsonResponseDollars,
    history: jsonResponseHistory,
    requests: jsonResponseRequests,
    friends: jsonResponseFriends,
    groupRequest: jsonResponceMeta
  };

  return res.status(200).json(jsonResponse);
});


const startServer = async () => {
  await Moralis.start({
    apiKey: process.env.MORALIS_KEY,
  });

  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
};

startServer();