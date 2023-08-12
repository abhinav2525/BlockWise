import { Button } from "antd";

const ConnectButton = ({ connect }) => (
  <button
    className="connect-btn"
    onClick={() => {
      connect();
    }}
  >
    Connect Wallet
  </button>
);

export default ConnectButton;
