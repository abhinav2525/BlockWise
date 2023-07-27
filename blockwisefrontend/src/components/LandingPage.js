import React from 'react';
import '../LandingPage.css';
import backgroundImage from '../BW.png';  // Import the image here
import ConnectButton from './ConnectButton';
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { useConnect } from "wagmi";


const LandingPage = () => {
  const { connect } = useConnect({
    connector: new MetaMaskConnector(),
  });
  return (
    <div>
      <ConnectButton connect={connect} cl/>
    </div>
  );
};



export default LandingPage;