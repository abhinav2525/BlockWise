import {  Button, Modal, Input } from "antd";
import { FormOutlined } from "@ant-design/icons";
import "../App.css";
const UserName = ({
  name,
  address,
  balance,
  dollars,
  disconnectAndSetNull,
  nameModal,
  hideNameModal,
  modalName,
  setModalName,
  showNameModal,
  write,
}) => {
  return (
    <>
      {/* <h5>Connected Wallet: {address}</h5> */}

      {name ? (
        <>
          {/* <p>(Name : {name})</p>
          {balance && <p>(polygon balance: {balance})</p>}
          {dollars && <p>(polygon balance in USD: {dollars})</p>}
          <Button type={"primary"} onClick={disconnectAndSetNull}>
            Disconnect Wallet
          </Button> */}
        </>
      ) : (
        <>
          <Modal
            title="Enter the name"
            open={nameModal}
            onCancel={hideNameModal}
            onOk={() => {
              write();
              hideNameModal();
            }}
            okText="Set UserName"
            cancelText="Cancel"
          >
            <p>User Name</p>
            <Input
              placeholder="Enter the user name"
              value={modalName}
              onChange={(val) => {
                setModalName(val.target.value);
              }}
            />
          </Modal>
          <div>
            <Button
              type={"primary"}
              className="quickOption"
              onClick={() => {
                showNameModal();
              }}
            >
              <FormOutlined style={{ fontSize: "18px" }} />
              set username
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default UserName;
