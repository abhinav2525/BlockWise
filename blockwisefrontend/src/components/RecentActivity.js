import React from "react";
import { Card, Table, Avatar } from "antd";


function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


window.colorHash = {}

const dataSource = [
  {
    key: "1",
    subject: "Mike",
    type: "Send",
    address: "0x12...2345",
    message: "Cookies 🍪",
    amount: "$3.50",
  },
  {
    key: "2",
    subject: "Amanda",
    type: "Receive",
    address: "0x12...2345",
    message: "Dinner 🍔",
    amount: "$22.30",
  },
  {
    key: "3",
    subject: "Roy",
    type: "Send",
    address: "0x12...2345",
    message: "Movie Tickets",
    amount: "$17.31",
  },
  {
    key: "4",
    subject: "Amanda",
    type: "Send",
    address: "0x12...2345",
    message: "Lunch",
    amount: "$9.20",
  },
  {
    key: "5",
    subject: "Charlie",
    type: "Send",
    address: "0x12...2345",
    message: "Golf ⛳️",
    amount: "$49.99",
  },
  {
    key: "6",
    subject: "Charlie",
    type: "Receive",
    address: "0x12...2345",
    message: "Gatorade",
    amount: "$2.30",
  },
  {
    key: "7",
    subject: "Mike",
    type: "Send",
    address: "0x12...2345",
    message: "Poker ♠️",
    amount: "$3.50",
  },
  {
    key: "8",
    subject: "Jimmy",
    type: "Send",
    address: "0x12...2345",
    message: "Car Fix",
    amount: "$30.00",
  },
];

const columns = [
  {
    title: "Payment Subjet",
    dataIndex: "subject",
    key: "subject",
    render:(subject,row)=>{
      let color = subject;
      
      if(window.colorHash[subject]){
        color = window.colorHash[subject]
      }else{
        window.colorHash[subject] = getRandomColor()
      }
      color = window.colorHash[subject]
      return <> <Avatar  style={{
        background: color
      }}>{subject[0]}</Avatar> {subject}</>
    }
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },

  {
    title: "Message",
    dataIndex: "message",
    key: "message",
  },
  {
    title: "Amount",
    key: "amount",
    render: (_, record) => (
      <div
        style={record.type === "Send" ? { color: "red" } : { color: "green" }}
      >
        {record.type === "Send" ? "-" : "+"}
        {record.amount} Matic
      </div>
    ),
  },
  {
    title:"Date",
    dataIndex: "time",
    render:(_,row)=>{
      return new Intl.DateTimeFormat('en-US',{ dateStyle:'medium'}).format(new Date(_*1000),{})
    },
    key:"time",
  },
  {
    title:"Time",
    dataIndex: "time",
    render:(_,row)=>{
      return new Intl.DateTimeFormat('en-US',{timeStyle:'medium'}).format(new Date(_*1000),{})
    },
    key:"time",
  }
];

function RecentActivity({ history }) {

  return (
    <Card title="Recent Activity" style={{ width: "100%", minHeight: "850px" }}>
      {history && 
      <Table
        dataSource={history}
        columns={columns}
        pagination={{ position: ["bottomCenter"], pageSize: 8 }}
      />
    }
    </Card>
  );
}

export default RecentActivity;
