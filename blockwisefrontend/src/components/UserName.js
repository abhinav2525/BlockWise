import { Button, Modal, Input } from "antd";
import { FormOutlined } from "@ant-design/icons";
import "../App.css";
const UserName = ({
  name,
  disconnectAndSetNull,
  nameModal,
  hideNameModal,
  modalName,
  setModalName,
  showNameModal,
  writeAddName,
}) => {
  return (
    <>
      {name ? (
        <>
        </>
      ) : (
        <>
          <Modal
            title="Enter the name"
            open={nameModal}
            onCancel={hideNameModal}
            onOk={() => {
              writeAddName();
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
          <Button type={"primary"} onClick={disconnectAndSetNull}>
            Disconnect Wallet
          </Button>
        </>
      )}
    </>
  );
};

export default UserName;
