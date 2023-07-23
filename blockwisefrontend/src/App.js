import { useState, useEffect } from "react";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { polygonMumbai } from "@wagmi/chains";
import axios from "axios";
import ConnectButton from "./components/ConnectButton";
import ProfileInfo from "./components/ProfileInfo";
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
  const [requests, setRequests] = useState({ 1: [0], 0: [] });
  const [nameModal, setNameModal] = useState(false);
  const [modalName, setModalName] = useState("");

  function disconnectAndSetNull() {
    disconnect();
    setName("...");
    setBalance("...");
    setDollars("...");
    setHistory(null);
    setRequests({ 1: [0], 0: [] });
  }

  const { config, error } = usePrepareContractWrite({
    address: process.env.REACT_APP_BLOCKWISE_ADDRESS,
    abi: ABI,
    chainId: polygonMumbai.id,
    functionName: "addName",
    args: [modalName],
  });

  const { write, data, isLoading, isSuccess } = useContractWrite(config);

  async function getNameAndBalance() {
    const res = await axios.get(`http://localhost:3001/getNameAndBalance`, {
      params: { userAddress: address },
    });
    const response = res.data;
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

  useEffect(() => {
    if (!isConnected) return;
    getNameAndBalance();
  }, [isConnected, address]);

  return (
    <div className="App">
      <>
        {isConnected ? (
          <>
            <ProfileInfo
              name={name}
              address={address}
              balance={balance}
              dollars={dollars}
              disconnectAndSetNull={disconnectAndSetNull}
              nameModal={nameModal}
              hideNameModal={hideNameModal}
              modalName={modalName}
              setModalName={setModalName}
              showNameModal={showNameModal}
              write={write}
            />
          </>
        ) : (
          <ConnectButton connect={connect} />
        )}
      </>
    </div>
  );
}

export default App;
