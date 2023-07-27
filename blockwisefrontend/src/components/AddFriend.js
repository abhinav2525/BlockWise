import { Button, Modal, Input } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import "../App.css";
const AddFriend = ({
    name,
    friendModal,
    showAddFriendModal,
    hideAddFriendModal,
    writeAddFriend,
    friend,
    setFriend,
}) => {
    return (
        <>
            {name ? (

                <>
                    <Modal
                        title="Enter AddFriend"
                        open={friendModal}
                        onCancel={hideAddFriendModal}
                        onOk={() => {
                            writeAddFriend();
                            hideAddFriendModal();
                        }}
                        okText="AddFriend"
                        cancelText="Cancel"
                    >
                        <Input
                            placeholder="Enter the address"
                            value={friend}
                            onChange={(val) => {
                                setFriend(val.target.value);
                            }}
                        />
                    </Modal>
                    <div>
                        <Button
                            type={"primary"}
                            className="quickOption"
                            onClick={() => {
                                showAddFriendModal();
                            }}
                        >
                            <UserAddOutlined style={{ fontSize: "18px" }} />
                            AddFriend
                        </Button>
                    </div>
                </>

            ) : (
                <>
                </>
            )}
        </>
    );
};

export default AddFriend;
