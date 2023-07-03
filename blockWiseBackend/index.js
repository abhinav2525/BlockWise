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

// app.get("/getHistory", async(req, res)=>{

// })
// const runApp = async () => {
//     await Moralis.start({
//       apiKey: "mizmGWV3pf3Bj76LgHnEqx334lxAjT5XsoNtqDloM9vEPglAE8zVNFh1cVKU2GDt",
//       // ...and any other configuration
//     });
  
//     const address = '0x11bd4f78a0Cb724AF61A47ae7a27959e08dA3e2A';
  
//     const chain = EvmChain.ETHEREUM;
  
//     const response = await Moralis.EvmApi.balance.getNativeBalance({
//       address,
//       chain,
//     });
  
//       console.log(response.toJSON());
//   }
  
//   runApp();

app.get("/", (req, res) => {
  res.send("<h1> Hello from blockWise Backend APIs</h1>");
});

app.get("/getMyHistory", async (req, res)=> {
  const { userAddress } = req.query;

  const fourResponse = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: process.env.BLOCKWISE_ADDRESS,
    functionName: "getMyHistory",
    abi: ABI,
    params: { _user: userAddress },
  });

  return res.status(200).send(fourResponse);

})

app.get("/getMyName", async (req,res)=> {
  const { userAddress } = req.query;
  const response = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: process.env.BLOCKWISE_ADDRESS,
    functionName: "getMyName",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseName = response.raw;

  return res.status(200).send(jsonResponseName);

})

app.get("/getBalanceInUSD", async (req,res)=> {
  const { userAddress } = req.query;
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

  return res.status(200).send(jsonResponseDollars);
})

app.get("/getMyRequest", async (req,res)=>{
  const { userAddress } = req.query;
  const fiveResponse = await Moralis.EvmApi.utils.runContractFunction({
    chain: "0x13881",
    address: process.env.BLOCKWISE_ADDRESS,
    functionName: "getMyRequests",
    abi: ABI,
    params: { _user: userAddress },
  });

  const jsonResponseRequests = fiveResponse.raw;
  return res.status(200).send(jsonResponseRequests);

})
const startServer = async () => {
  await Moralis.start({
    apiKey: process.env.MORALIS_KEY,
  });

  app.listen(port, () => {
    console.log(`app listening on port ${port}`);
  });
};

startServer();

