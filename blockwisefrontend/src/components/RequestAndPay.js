import React, { useState, useEffect } from "react";
import { DollarOutlined, SwapOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Modal, Input, InputNumber,Select, Space } from "antd";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction  } from "wagmi";
import { polygonMumbai } from "@wagmi/chains";
import ABI from "../abi.json";


function RequestAndPay({ requests, getNameAndBalance, friends }) {
  const [payModal, setPayModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [groupRequestModel, setGroupRequestModel] = useState(false);
  // const [groupRequestAmount, setGroupRequestAmount] = useState(6);
  const [requestGroupAddress, setRequestGroupAddress] = useState([]);
  const [requestAmount, setRequestAmount] = useState(5);
  const [requestAddress, setRequestAddress] = useState("");
  const [requestMessage, setRequestMessage] = useState("");



  const friendsOptions = friends.map(friend => ({
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

  const { write: writeRequest, data: dataRequest } = useContractWrite(configRequest);

  const { config: configGroupRequest } = usePrepareContractWrite({
    chainId: polygonMumbai.id,
    address: process.env.REACT_APP_BLOCKWISE_ADDRESS,
    abi: ABI,
    functionName: "createGroupRequest",
    args: [requestAmount, requestMessage, requestGroupAddress],
  });

  const { write: groupRequest, data: groupRequestData } = useContractWrite(configGroupRequest);

  const { isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  })

  const { isSuccess: isSuccessRequest } = useWaitForTransaction({
    hash: dataRequest?.hash,
  })


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
  }

  const hideGroupRequestModel = () => {
    setGroupRequestModel(false);
  }

  useEffect(()=>{
    if(isSuccess || isSuccessRequest){
      getNameAndBalance();
    }
    console.log(setRequestGroupAddress);
  },[isSuccess, isSuccessRequest])

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
        <InputNumber value={requestAmount} onChange={(val)=>setRequestAmount(val)}/>
        <p>From (address)</p>
        <Input placeholder="0x..." value={requestAddress} onChange={(val)=>setRequestAddress(val.target.value)}/>
        <p>Message</p>
        <Input placeholder="Lunch Bill..." value={requestMessage} onChange={(val)=>setRequestMessage(val.target.value)}/>
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
        <InputNumber value={requestAmount} onChange={(val) => setRequestAmount(val)} />
        <p>Add people</p>
        <Space
          style={{
            width: '100%',
          }}
          direction="vertical"
        >
          <Select
            mode="multiple"
            allowClear
            style={{
              width: '100%',
            }}
            placeholder="Please select your friends for the split"
            onChange={handleFriendSelect}
            options={friendsOptions}
          />
        </Space>
        <p>Message</p>
        <Input placeholder="description" value={requestMessage} onChange={(val) => setRequestMessage(val.target.value)} />
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
          onClick={()=>{
            showGroupRequestModel();
          }}
        >
          <UsergroupAddOutlined style={{ fontSize: "26px" }}/>
          Grp Req
        </div>
      </div>
    </>
  );
}

export default RequestAndPay;
