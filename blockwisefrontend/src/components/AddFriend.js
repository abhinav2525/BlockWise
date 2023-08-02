import { Button, Modal, Input, notification } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import "../App.css";
import { useRef, useState } from "react";
const AddFriend = ({
    name,
    friendModal,
    showAddFriendModal,
    hideAddFriendModal,
    writeAddFriend,
    friend,
    setFriend,
}) => {
    const [add,setAdd] = useState("")
    const inputRef = useRef(null);
    return (
        <>
            {name ? (

                <>
                    <Modal
                        title="Enter AddFriend"
                        open={friendModal}
                        onCancel={hideAddFriendModal}
                        onOk={() => {
                            if(!add){
                                notification.error({
                                    description:"Please enter the proper address"
                                })
                                inputRef.current.focus()
                                    return;
                            }
                            writeAddFriend?.();
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
                            autoFocus
                            ref={inputRef}
                        />
                    </Modal>
                    <div>
                        <Button
                            type={"primary"}
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
