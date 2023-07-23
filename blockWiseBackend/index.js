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

// app.get("/getMyHistory", async (req, res)=> {
//   const { userAddress } = req.query;

//   const fourResponse = await Moralis.EvmApi.utils.runContractFunction({
//     chain: "0x13881",
//     address: process.env.BLOCKWISE_ADDRESS,
//     functionName: "getMyHistory",
//     abi: ABI,
//     params: { _user: userAddress },
//   });

//   return res.status(200).send(fourResponse);

// })

// app.get("/getMyName", async (req,res)=> {
//   const { userAddress } = req.query;
//   const response = await Moralis.EvmApi.utils.runContractFunction({
//     chain: "0x13881",
//     address: process.env.BLOCKWISE_ADDRESS,
//     functionName: "getMyName",
//     abi: ABI,
//     params: { _user: userAddress },
//   });

//   const jsonResponseName = response.raw;

//   return res.status(200).send(jsonResponseName);

// })

// app.get("/getBalanceInUSD", async (req,res)=> {
//   const { userAddress } = req.query;
//   const secResponse = await Moralis.EvmApi.balance.getNativeBalance({
//     chain: "0x13881",
//     address: userAddress,
//   });

//   const jsonResponseBal = (secResponse.raw.balance / 1e18).toFixed(2);

//   const thirResponse = await Moralis.EvmApi.token.getTokenPrice({
//     address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
//   });

//   const jsonResponseDollars = (
//     thirResponse.raw.usdPrice * jsonResponseBal
//   ).toFixed(2);

//   return res.status(200).send(jsonResponseDollars);
// })

// app.get("/getMyRequest", async (req,res)=>{
//   const { userAddress } = req.query;
//   const fiveResponse = await Moralis.EvmApi.utils.runContractFunction({
//     chain: "0x13881",
//     address: process.env.BLOCKWISE_ADDRESS,
//     functionName: "getMyRequests",
//     abi: ABI,
//     params: { _user: userAddress },
//   });

//   const jsonResponseRequests = fiveResponse.raw;
//   return res.status(200).send(jsonResponseRequests);

// })


function convertArrayToObjects(arr) {
  const dataArray = arr.map((transaction, index) => ({
    key: (arr.length + 1 - index).toString(),
    type: transaction[0],
    amount: transaction[1],
    message: transaction[2],
    address: `${transaction[3].slice(0,4)}...${transaction[3].slice(0,4)}`,
    subject: transaction[4],
  }));

  return dataArray.reverse();
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


  const jsonResponse = {
    name: jsonResponseName,
    balance: jsonResponseBal,
    dollars: jsonResponseDollars,
    history: jsonResponseHistory,
    requests: jsonResponseRequests,
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

