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
    <div className='container'>
      <div className="column"></div>
      <div className="column center-grid">
        <ConnectButton connect={connect} />
      </div>
    </div>
  );
};



export default LandingPage;