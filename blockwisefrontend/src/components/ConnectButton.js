import { Button } from "antd";

const ConnectButton = ({ connect }) => (
  <Button
    type={"primary"}
    onClick={() => {
      connect();
    }}
  >
    Connect Wallet
  </Button>
);

export default ConnectButton;
