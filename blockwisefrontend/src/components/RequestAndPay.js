import React, { useState, useEffect } from "react";
import {
  DollarOutlined,
  SwapOutlined,
  UsergroupAddOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Input,
  InputNumber,
  Select,
  Space,
  Card,
  Table,
  Button,
} from "antd";
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { polygonMumbai } from "@wagmi/chains";
import ABI from "../abi.json";
import { Spin } from "antd";

function RequestAndPay({ requests, getNameAndBalance, friends, groupReqAcpt }) {
  const [payModal, setPayModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [groupRequestModel, setGroupRequestModel] = useState(false);
  const [groupRequestAcceptModel, setGroupRequestAcceptModel] = useState(false);

  const [acceptLoading, setAcceptLoading] = useState(false);
  const [loadingIdx, setLoadingIdx] = useState(-1);

  const [declineLoading, setDeclineLoading] = useState(false);
  // const [groupReqaddress, setGroupReqaddress] = useState('0x9C1FD19f360B6181B67D8EeCF0739FE2EF5C1D23');
  // const [groupReqId, setGroupReqId] = useState(1);

  const [groupReqaddress, setGroupReqaddress] = useState(null);
  const [groupReqId, setGroupReqId] = useState(null);
  // const [groupRequestAmount, setGroupRequestAmount] = useState(6);
  const [requestGroupAddress, setRequestGroupAddress] = useState([]);
  const [requestAmount, setRequestAmount] = useState(5);
  const [requestAddress, setRequestAddress] = useState("");
  const [requestMessage, setRequestMessage] = useState("");

  const friendsOptions = friends.map((friend) => ({
    label: friend.name,
    value: friend.address,
  }));

  const handleFriendSelect = (value) => {
    setRequestGroupAddress(value);
  };

  const { config } = usePrepareContractWrite({
    chainId: polygonMumbai.id,
    address: process.env.REACT_APP_BLOCKWISE_ADDRESS,
    abi: ABI,
    functionName: "payRequest",
    args: [0],
    overrides: {
      value: String(Number(requests["1"][0] * 1e18)),
    },
  });

  const { write, data } = useContractWrite(config);

  const { config: configRequest } = usePrepareContractWrite({
    chainId: polygonMumbai.id,
    address: process.env.REACT_APP_BLOCKWISE_ADDRESS,
    abi: ABI,
    functionName: "createRequest",
    args: [requestAddress, requestAmount, requestMessage],
  });

  const { write: writeRequest, data: dataRequest } =
    useContractWrite(configRequest);

  const { config: configGroupRequest } = usePrepareContractWrite({
    chainId: polygonMumbai.id,
    address: process.env.REACT_APP_BLOCKWISE_ADDRESS,
    abi: ABI,
    functionName: "createGroupRequest",
    args: [requestAmount, requestMessage, requestGroupAddress],
  });

  // useEffect(() => {console.log({configGroupRequest})},[configGroupRequest]);

  const { write: groupRequest, data: groupRequestData } =
    useContractWrite(configGroupRequest);

  const { config: configGroupRequestAccept, error: groupRequestAcceptError } =
    usePrepareContractWrite({
      chainId: polygonMumbai.id,
      address: process.env.REACT_APP_BLOCKWISE_ADDRESS,
      abi: ABI,
      functionName: "acceptGroupRequest",
      args: [groupReqaddress, groupReqId],
    });

  useEffect(() => {
    console.log({ configGroupRequestAccept, groupRequestAcceptError });
  }, [configGroupRequestAccept, groupRequestAcceptError]);

  const { write: GroupRequestAccept, data: groupRequestAcceptData } =
    useContractWrite(configGroupRequestAccept);

  const { config: configGroupRequestDelete, error: groupRequestDeleteError } =
    usePrepareContractWrite({
      chainId: polygonMumbai.id,
      address: process.env.REACT_APP_BLOCKWISE_ADDRESS,
      abi: ABI,
      functionName: "deleteGroupRequest",
      args: [groupReqaddress, groupReqId],
    });

  const { write: GroupRequestDelete, data: groupRequestDeleteData } =
    useContractWrite(configGroupRequestDelete);

  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const { isSuccess: isSuccessRequest } = useWaitForTransaction({
    hash: dataRequest?.hash,
  });

  const { isSuccess: isSuccessGroupRequest } = useWaitForTransaction({
    hash: dataRequest?.hash,
  });

  const showPayModal = () => {
    setPayModal(true);
  };
  const hidePayModal = () => {
    setPayModal(false);
  };

  const showRequestModal = () => {
    setRequestModal(true);
  };
  const hideRequestModal = () => {
    setRequestModal(false);
  };

  const showGroupRequestModel = () => {
    setGroupRequestModel(true);
  };

  const hideGroupRequestModel = () => {
    setGroupRequestModel(false);
  };

  const showGroupRequesAccepttModel = () => {
    setGroupRequestAcceptModel(true);
  };

  const hideGroupRequestAcceptModel = () => {
    setGroupRequestAcceptModel(false);
  };

  // useEffect(()  => {
  //   console.log({groupReqaddress, groupReqId})
  // },[groupReqId,groupReqaddress])

  useEffect(() => {
    if (isSuccess || isSuccessRequest || isSuccessGroupRequest) {
      getNameAndBalance();
    }
    // console.log(setRequestGroupAddress);
  }, [isSuccess, isSuccessRequest, isSuccessGroupRequest]);

  const columns = [
    {
      title: "Creator",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Created",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (_, row) => {
        return new Intl.DateTimeFormat("en-US", { timeStyle: "medium" }).format(
          new Date(_ * 1000),
          {}
        );
      },
    },
    {
      title: "Accept",
      dataIndex: "requestID",
      key: "requestID",
      render: (_, row) => {
        return (
          <Button
            type={"primary"}
            onClick={() => {
              console.log({ thisVar: _ });
              setGroupReqaddress(row.address);
              setGroupReqId(row.requestID);
              setTimeout(() => {
                GroupRequestAccept?.();
                setAcceptLoading(false);
                setLoadingIdx(-1);
              }, [5000]);
              setAcceptLoading(true);
              setLoadingIdx(_);
            }}
          >
            {" "}
            {acceptLoading && loadingIdx === _ ? (
              <Spin />
            ) : (
              <>
                <CheckOutlined style={{ fontSize: "18px" }} /> Accept
              </>
            )}
          </Button>
        );
      },
    },
    {
      title: "Decline",
      dataIndex: "timestamp",
      key: "requestID",
      render: (_, row) => {
        return (
          <Button
            type="primary"
            danger
            onClick={() => {
              setGroupReqaddress(row.address);
              setGroupReqId(row.requestID);
              setTimeout(() => {
                GroupRequestDelete?.();
                setDeclineLoading(false);
                setLoadingIdx(-1);
              }, 2000);
              setDeclineLoading(true);
              setLoadingIdx(_);
            }}
          >
            {" "}
            {declineLoading && loadingIdx === _ ? (
              <Spin />
            ) : (
              <>
                <CloseOutlined style={{ fontSize: "18px" }} /> Decline
              </>
            )}
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        title="Confirm Payment"
        open={payModal}
        onOk={() => {
          write?.();
          hidePayModal();
        }}
        onCancel={hidePayModal}
        okText="Proceed To Pay"
        cancelText="Cancel"
      >
        {requests && requests["0"].length > 0 && (
          <>
            <h2>Sending payment to {requests["3"][0]}</h2>
            <h3>Value: {requests["1"][0]} Matic</h3>
            <p>"{requests["2"][0]}"</p>
          </>
        )}
      </Modal>
      <Modal
        title="Request A Payment"
        open={requestModal}
        onOk={() => {
          writeRequest?.();
          hideRequestModal();
        }}
        onCancel={hideRequestModal}
        okText="Proceed To Request"
        cancelText="Cancel"
      >
        <p>Amount (Matic)</p>
        <InputNumber
          value={requestAmount}
          onChange={(val) => setRequestAmount(val)}
        />
        <p>From (address)</p>
        <Input
          placeholder="0x..."
          value={requestAddress}
          onChange={(val) => setRequestAddress(val.target.value)}
        />
        <p>Message</p>
        <Input
          placeholder="Lunch Bill..."
          value={requestMessage}
          onChange={(val) => setRequestMessage(val.target.value)}
        />
      </Modal>

      <Modal
        title="Group request"
        open={groupRequestModel}
        onOk={() => {
          groupRequest?.();
          hideGroupRequestModel();
        }}
        onCancel={hideGroupRequestModel}
        okText="Proceed To Request"
        cancelText="Cancel"
      >
        <p>Amount (Matic)</p>
        <InputNumber
          value={requestAmount}
          onChange={(val) => setRequestAmount(val)}
        />
        <p>Add people</p>
        <Space
          style={{
            width: "100%",
          }}
          direction="vertical"
        >
          <Select
            mode="multiple"
            allowClear
            style={{
              width: "100%",
            }}
            placeholder="Please select your friends for the split"
            onChange={handleFriendSelect}
            options={friendsOptions}
          />
        </Space>
        <p>Message</p>
        <Input
          placeholder="description"
          value={requestMessage}
          onChange={(val) => setRequestMessage(val.target.value)}
        />
      </Modal>
      <Modal
        width="450"
        title="Accept Group Requests"
        open={groupRequestAcceptModel}
        onOk={() => {
          hideGroupRequestAcceptModel();
        }}
        onCancel={hideGroupRequestAcceptModel}
        cancelText="Cancel"
      >
        <Card>
          <Table
            dataSource={groupReqAcpt}
            columns={columns}
            pagination={{ position: ["bottomCenter"], pageSize: 8 }}
          />
        </Card>
      </Modal>
      <div className="requestAndPay">
        <div
          className="quickOption"
          onClick={() => {
            showPayModal();
          }}
        >
          <DollarOutlined style={{ fontSize: "26px" }} />
          Pay
          {requests && requests["0"].length > 0 && (
            <div className="numReqs">{requests["0"].length}</div>
          )}
        </div>
        <div
          className="quickOption"
          onClick={() => {
            showRequestModal();
          }}
        >
          <SwapOutlined style={{ fontSize: "26px" }} />
          Request
        </div>
        <div
          className="quickOption"
          onClick={() => {
            showGroupRequestModel();
          }}
        >
          <UsergroupAddOutlined style={{ fontSize: "26px" }} />
          Grp Req
        </div>
        <div
          className="quickOption"
          onClick={() => {
            showGroupRequesAccepttModel();
          }}
        >
          <UsergroupAddOutlined style={{ fontSize: "26px" }} />
          Grp Acpt
          {groupReqAcpt && groupReqAcpt.length > 0 && (
            <div className="numReqs">{groupReqAcpt.length}</div>
          )}
        </div>
      </div>
    </>
  );
}

export default RequestAndPay;
