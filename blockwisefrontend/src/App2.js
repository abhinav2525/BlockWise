import { useState, useEffect } from "react";
import "./App.css";
import { useConnect, useAccount, useDisconnect } from "wagmi";
import { Layout, Button } from "antd";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import {
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import { polygonMumbai } from "@wagmi/chains";
import axios from "axios";
import ConnectButton from "./components/ConnectButton";
import UserName from "./components/UserName";
import CurrentBalance from "./components/CurrentBalance";
import RequestAndPay from "./components/RequestAndPay";
import AccountDetails from "./components/AccountDetails";
import RecentActivity from "./components/RecentActivity";
import AddFriend from "./components/AddFriend";
import LandingPage from "./components/LandingPage";
const ABI = require("./abi.json");

const { Header, Content } = Layout;

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


  const [friendModal, setFriendModal] = useState(false);
  const [friend, setFriend] = useState("");


  function disconnectAndSetNull() {
    disconnect();
    setName("...");
    setBalance("...");
    setDollars("...");
    setHistory(null);
    setRequests({ 1: [0], 0: [] });
  }

  const { config } = usePrepareContractWrite({
    address: process.env.REACT_APP_BLOCKWISE_ADDRESS,
    abi: ABI,
    chainId: polygonMumbai.id,
    functionName: "addName",
    args: [modalName],
  });

  const { write: writeAddName } = useContractWrite(config);

  const { config: addFriendAddress } = usePrepareContractWrite({
    address: process.env.REACT_APP_BLOCKWISE_ADDRESS,
    abi: ABI,
    chainId: polygonMumbai.id,
    functionName: "addFriend",
    args: [friend],
  });

  const { write: writeAddFriend } = useContractWrite(addFriendAddress);

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

  const showAddFriendModal = () => {
    setFriendModal(true);
  };
  const hideAddFriendModal = () => {
    setFriendModal(false);
    setFriend("");
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
            <UserName
              name={name}
              disconnectAndSetNull={disconnectAndSetNull}
              nameModal={nameModal}
              hideNameModal={hideNameModal}
              modalName={modalName}
              setModalName={setModalName}
              showNameModal={showNameModal}
              writeAddName={writeAddName}
            />
          </>
        ) : (
          <>
            {/* <div>Please Login</div>
          <ConnectButton connect={connect} /> */}
          </>
        )}
      </>
      {name && isConnected? (
        <Layout>
          <Header className="header">
            <div className="headerLeft">
              {/* <img src={logo} alt="logo" className="logo" /> */}
              {isConnected && (
                <>
                  <div
                    className="menuOption"
                    style={{ borderBottom: "1.5px solid black" }}
                  >
                    Summary
                  </div>
                  <div className="menuOption">Activity</div>
                  <div className="menuOption">{`Send & Request`}</div>
                  <div className="menuOption">Wallet</div>
                  <div className="menuOption">Help</div>
                </>
              )}
            </div>
            {isConnected ? (
              <>

                <AddFriend
                  name={name}
                  friendModal={friendModal}
                  showAddFriendModal={showAddFriendModal}
                  hideAddFriendModal={hideAddFriendModal}
                  writeAddFriend={writeAddFriend}
                  friend={friend}
                  setFriend={setFriend}
                />
                <Button type={"primary"} onClick={disconnectAndSetNull}>
                  Disconnect Wallet
                </Button>
              </>
            ) : (
              <></>
              // <ConnectButton connect={connect} />
            )}
          </Header>
          <Content className="content">
            {isConnected ? (
              <>
                <div className="firstColumn">
                  <CurrentBalance dollars={dollars} />
                  <RequestAndPay requests={requests} getNameAndBalance={getNameAndBalance} />
                  <AccountDetails
                    address={address}
                    name={name}
                    balance={balance}
                  />
                </div>
                <div className="secondColumn">
                  <RecentActivity history={history} />
                </div>
              </>
            ) : (
              <>
              {/* <div>Please Login</div> */}
              {/* <LandingPage /> */}
              </>
            )}
          </Content>
        </Layout>) : (
        <>
          {/* <ConnectButton connect={connect} />  */}
          <LandingPage />
        </>)
      }

    </div>
  );
}

export default App;
