import { Button, Modal, Input, Spin } from "antd";
import { FormOutlined } from "@ant-design/icons";
import "../App.css";
import "../LandingPage.css";
const UserName = ({
  isLoading,
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
              {isLoading ? (
                <Spin size="large">
                  <div className="content" />
                </Spin>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <button
                    className="connect-btn"
                    style={{ margin: "20px" }}
                    onClick={() => {
                      showNameModal();
                    }}
                  >
                    <FormOutlined style={{ fontSize: "18px" }} />
                    Set Username
                  </button>
                  <button
                    className="connect-btn"
                    style={{ margin: "20px" }}
                    onClick={disconnectAndSetNull}
                  >
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserName;
