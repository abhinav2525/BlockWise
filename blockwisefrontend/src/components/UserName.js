import { Button, Modal, Input } from "antd";
import { FormOutlined } from "@ant-design/icons";
import "../App.css";
import "../LandingPage.css";
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
        <></>
      ) : (
        <>
          <Modal
            title="Enter the name"
            open={nameModal}
            onCancel={hideNameModal}
            onOk={() => {
              writeAddName?.();
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
          <div className="container">
            <div className="column"></div>
            <div
              column="column center-grid"
              style={{ flex: "1", display: "grid", placeItems: "center" }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <Button
                  type={"primary"}
                  onClick={() => {
                    showNameModal();
                  }}
                >
                  <FormOutlined style={{ fontSize: "18px" }} />
                  set username
                </Button>
                <Button type={"primary"} onClick={disconnectAndSetNull}>
                  Disconnect Wallet
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserName;
