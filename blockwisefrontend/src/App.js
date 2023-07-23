import { useState, useEffect } from "react";
import { Layout, Button, Modal, Input, InputNumber } from "antd";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { DollarOutlined,FormOutlined } from "@ant-design/icons";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import { polygonMumbai } from "@wagmi/chains";
import axios from "axios";
const ABI = require("./abi.json");


function App() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });

  const [name, setName] = useState("...");
  const [balance, setBalance] = useState("...");
  const [dollars, setDollars] = useState("...");
  const [history, setHistory] = useState(null);
  const [requests, setRequests] = useState({ "1": [0], "0": [] });
  const [nameModal, setNameModal] = useState(false);
  const [modalName, setModalName] = useState("");

  function disconnectAndSetNull() {
    disconnect();
    setName("...");
    setBalance("...");
    setDollars("...");
    setHistory(null);
    setRequests({ "1": [0], "0": [] });
  }

  const { config } = usePrepareContractWrite({
    address: process.env.BLOCKWISE_ADDRESS,
    abi: ABI,
    chainId: 80001,
    functionName: "addName(string)",
    args: [modalName],
  });

  const { write } = useContractWrite(config);

  async function getNameAndBalance() {
    const res = await axios.get(`http://localhost:3001/getNameAndBalance`, {
      params: { userAddress: address },
    });
    const response = res.data;
    console.log(response.name);
    if (response.name[1]) {
      setName(response.name[0]);
    } else {
      setName();
    }
    setBalance(String(response.balance));
    setDollars(String(response.dollars));
    setHistory(response.history);
    setRequests(response.requests);

  }

  const showNameModal = () => {
    setNameModal(true);
  };
  const hideNameModal = () => {
    setNameModal(false);
    setModalName("");
  };

  // function changeReceiver(e){
  //   modalName(e.target.value)
  // }

  useEffect(() => {
    if (!isConnected) return;
    getNameAndBalance();
    // showNameModal();
  }, [isConnected, address]);

  

  return (
    <div className="App">

      <>
        {isConnected ?

          <>
            <h5>Connected Wallet: {address}</h5>
            {name ?
              <>
                <p>(Name : {name})</p>
                {balance && <p>(polygon balance: {balance})</p>}
                {dollars && <p>(polygon balance in USD: {dollars})</p>}
                <Button type={"primary"} onClick={disconnectAndSetNull}>
                  Disconnect Wallet
                </Button>

              </>
              :
              <>
                <Modal
                  title="Enter the name"
                  open={nameModal}
                  onCancel={hideNameModal}
                  onOk={()=>{
                    write?.();
                    hideNameModal();
                    console.log(write);
                  }}
                  okText="Set UserName"
                  cancelText="Cancel"
                >
                  <p>User Name</p>
                  <Input placeholder="Enter the user name" onChange={(val) => {setModalName(val.target.value); console.log(setName)}} />
                  {/* <Input placeholder="Enter the user name" onChange={changeReceiver} /> */}
                </Modal>
            <div>
            <Button type={"primary"}
              className="quickOption"
              onClick={() => {
                showNameModal();
              }}
            > 
              <FormOutlined style={{ fontSize: "18px" }}/>
              set username
            </Button>
            </div>
            </>

          }
          </> : (
            <Button type={"primary"} onClick={() => {
              console.log(requests); connect();
            }}>
              Connect Wallet
            </Button>
          )}
      </>

    </div>
  );
}

export default App;
