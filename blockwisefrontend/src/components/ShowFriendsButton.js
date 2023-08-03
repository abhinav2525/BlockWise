import { Button, Modal, Avatar,  List} from "antd";
import { RobotOutlined } from "@ant-design/icons";
import "../App.css";
import React, { useState } from "react";

const ShowFriendsButton = ({name,friends}
    ) => {
        const data = friends;
        const [friendListModal, setFriendListModal] = useState(false);
        const showFriendListModal = () => {
            setFriendListModal(true);
          }
        
          const hideFriendListModal = () => {
            setFriendListModal(false);
          }
    return (
        <>
            {name ? (

                <>
                    <Modal
                        title="Friend List"
                        open={friendListModal}
                        onCancel={hideFriendListModal}
                        cancelText="Close"
                    >
                        <List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={(item, index) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                                        title={<a href={`https://mumbai.polygonscan.com/address/${item.address}`}>{item.name}</a>}
                                        description={item.address}
                                    />
                                </List.Item>
                            )}
                        />

                    </Modal>
                    <div>
                        <Button
                            type={"primary"}
                            onClick={() => {
                                showFriendListModal();
                            }}
                        >
                            <RobotOutlined style={{ fontSize: "18px" }} />
                            Friends
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

export default ShowFriendsButton;
