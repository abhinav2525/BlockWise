import { Button } from "antd";

const DisConnectButton = ({ connect }) => (
  <Button
    type={"primary"}
    onClick={() => {
      connect();
    }}
  >
    Connect Wallet
  </Button>
);

export default DisConnectButton;