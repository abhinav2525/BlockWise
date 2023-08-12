// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Blockwise {
    // Define the Owner of the smart contract

    address private owner;

    constructor() {
        owner = msg.sender;
    }

    // Create struct and Mapping for request, transaction & name

    struct request {
        // our pending request
        address payable requestor;
        uint256 amount;
        string message;
        string name;
        uint256 blockTime;
    }

    struct sendReceive {
        string action;
        uint256 amount;
        string message;
        address otherPartyAddress;
        string otherPartyName;
        uint256 blockTime;
    }

    struct userName {
        string name;
        bool hasName;
    }

    struct Friend {
        string name;
        address walletAddress;
    }

    // Each user has a unique set of friends.
    mapping(address => Friend[]) private friends;

    struct GroupRequest {
        uint256 totalAmount;
        mapping(address => bool) acceptances;
        uint256 numberOfAcceptances;
        bool active;
        string description;
        address[] participants;
        address requestor;
    }

    struct GroupRequestMeta {
        address creator;
        uint256 requestIndex;
        bool isActive;
        address[] participants;
        uint256 blockTime;
        string description;
        string name;
    }

    mapping(address => GroupRequestMeta[]) public groupRequestMetas;
    mapping(address => uint256) public numGroupRequests;
    mapping(address => mapping(uint256 => GroupRequest))
        public userGroupRequests;
    mapping(address => uint256[]) public creatorGroupRequestIndices;

    function createGroupRequest(
        uint256 totalAmount,
        string memory description,
        address[] memory participants
    ) public returns (uint256) {
        uint256 requestIndex = numGroupRequests[msg.sender]++;

        GroupRequest storage newGroupRequest = userGroupRequests[msg.sender][
            requestIndex
        ];
        newGroupRequest.totalAmount = totalAmount;
        newGroupRequest.description = description;
        newGroupRequest.participants = participants;
        newGroupRequest.requestor = msg.sender;
        newGroupRequest.active = true;

        for (uint256 i = 0; i < participants.length; i++) {
            newGroupRequest.acceptances[participants[i]] = false;
        }

        GroupRequestMeta memory newMeta = GroupRequestMeta({
            creator: msg.sender,
            requestIndex: requestIndex,
            isActive: true,
            participants: participants,
            description: description,
            blockTime: block.timestamp,
            name: names[msg.sender].name
        });

        for (uint256 i = 0; i < participants.length; i++) {
            groupRequestMetas[participants[i]].push(newMeta);
        }

        return requestIndex;
    }

    function getGroupRequestMetasIfParticipant(address _user)
        public
        view
        returns (
            address[] memory,
            string[] memory,
            uint256[] memory,
            string[] memory,
            uint256[] memory
        )
    {
        uint256 count = 0;
        for (uint256 i = 0; i < groupRequestMetas[_user].length; i++) {
            if (groupRequestMetas[_user][i].isActive) {
                count++;
            }
        }

        address[] memory creator = new address[](count);
        uint256[] memory requestIndices = new uint256[](count);
        string[] memory name = new string[](count);
        string[] memory description = new string[](count);
        uint256[] memory timestamp = new uint256[](count);
        uint256 j = 0;
        for (uint256 i = 0; i < groupRequestMetas[_user].length; i++) {
            if (groupRequestMetas[_user][i].isActive) {
                creator[j] = groupRequestMetas[_user][i].creator;
                requestIndices[j] = groupRequestMetas[_user][i].requestIndex;
                name[j] = groupRequestMetas[_user][i].name;
                description[j] = groupRequestMetas[_user][i].description;
                timestamp[j] = groupRequestMetas[_user][i].blockTime;
                j++;
            }
        }

        return (creator, name, requestIndices, description, timestamp);
    }

    function acceptGroupRequest(address creator, uint256 groupRequestId)
        public
    {
        // Fetch the groupRequest using the ID
        GroupRequest storage groupRequest = userGroupRequests[creator][
            groupRequestId
        ];

        // Check if the group request is active
        require(groupRequest.active, "Group request is not active");

        // check  owner cannot acceptGroupRequest
        require(
            groupRequest.requestor != msg.sender,
            "Creator cannot accept the request"
        );

        // Check if the caller is one of the participants
        bool isParticipant = false;
        for (uint256 i = 0; i < groupRequest.participants.length; i++) {
            if (groupRequest.participants[i] == msg.sender) {
                isParticipant = true;
                break;
            }
        }
        require(
            isParticipant,
            "You are not a participant in this group request"
        );

        // Check if groupRequest has already been accepted by the current user
        require(
            !groupRequest.acceptances[msg.sender],
            "You have already accepted this request"
        );

        // Increment the numberOfAcceptances by 1
        groupRequest.numberOfAcceptances += 1;

        // Mark the current user's acceptance as true
        groupRequest.acceptances[msg.sender] = true;

        executeGroupRequest(groupRequest.requestor, groupRequestId);
    }

    function deleteGroupRequest(address creator, uint256 groupRequestId)
        public
    {
        // Fetch the groupRequest using the ID
        GroupRequest storage groupRequest = userGroupRequests[creator][
            groupRequestId
        ];

        require(groupRequest.active, "Group request no longer exists");

        bool isParticipant = false;
        for (uint256 i = 0; i < groupRequest.participants.length; i++) {
            if (groupRequest.participants[i] == msg.sender) {
                isParticipant = true;
                break;
            }
        }
        require(
            isParticipant,
            "You are not a participant in this group request"
        );
        toDeleteGroupRequestMeta(creator, groupRequestId);
        groupRequest.active = false;
    }

    function executeGroupRequest(address creator, uint256 groupRequestId)
        public
    {
        // Fetch the groupRequest using the ID
        GroupRequest storage groupRequest = userGroupRequests[creator][
            groupRequestId
        ];

        // Check if the group request is active
        require(groupRequest.active, "Group request is not active");

        // Check if numberOfAcceptances is more than 40%
        require(groupRequest.numberOfAcceptances > 0, "Not enough acceptances");

        // Split the total amount amongst all participants and convert to wei
        uint256 individualAmount = (groupRequest.totalAmount) /
            (groupRequest.participants.length + 1);

        // Create a request for each participant
        for (uint256 i = 0; i < groupRequest.participants.length; i++) {
            // Using createRequest() function to create a payment request for each participant
            createRequestExe(
                groupRequest.requestor,
                groupRequest.participants[i],
                individualAmount,
                groupRequest.description
            );
        }

        // After the group request has been successfully executed, set the isActive flag to false for the appropriate GroupRequestMeta
        toDeleteGroupRequestMeta(creator, groupRequestId);

        // Mark the groupRequest as inactive
        groupRequest.active = false;
    }

    function toDeleteGroupRequestMeta(address creator, uint256 groupRequestId)
        private
    {
        for (
            uint256 i = 0;
            i < userGroupRequests[creator][groupRequestId].participants.length;
            i++
        ) {
            address participant = userGroupRequests[creator][groupRequestId]
                .participants[i];
            for (
                uint256 j = 0;
                j < groupRequestMetas[participant].length;
                j++
            ) {
                if (
                    groupRequestMetas[participant][j].creator == creator &&
                    groupRequestMetas[participant][j].requestIndex ==
                    groupRequestId
                ) {
                    groupRequestMetas[participant][j].isActive = false;
                    break;
                }
            }
        }
    }

    //Struct for storing Requests and their status (pending/accepted or rejected).
    mapping(address => userName) names;
    mapping(address => request[]) requests;
    mapping(address => sendReceive[]) history;

    function addName(string memory _name) public {
        userName storage newUserName = names[msg.sender];
        newUserName.name = _name;
        newUserName.hasName = true;
    }

    function addFriend(address _walletAddress) public {
        // Check if the friend's address exists in the names mapping and has a name

        require(
            msg.sender != _walletAddress,
            "Cannot add your address to friends list"
        );

        require(
            names[_walletAddress].hasName == true,
            "This address has not interacted with the contract or set a name"
        );

        // Check for duplicates
        for (uint256 i = 0; i < friends[msg.sender].length; i++) {
            require(
                friends[msg.sender][i].walletAddress != _walletAddress,
                "This friend already exists"
            );
        }

        // Add friend
        friends[msg.sender].push(
            Friend(names[_walletAddress].name, _walletAddress)
        );
    }

    function getAllFriends(address _user)
        public
        view
        returns (string[] memory, address[] memory)
    {
        string[] memory friendNames = new string[](friends[_user].length);
        address[] memory friendAddresses = new address[](friends[_user].length);

        for (uint256 i = 0; i < friends[_user].length; i++) {
            Friend storage friend = friends[_user][i];
            friendNames[i] = friend.name;
            friendAddresses[i] = friend.walletAddress;
        }

        return (friendNames, friendAddresses);
    }

    //Create a Request

    function createRequest(
        address user,
        uint256 _amount,
        string memory _message
    ) public {
        // TODO: change
        request memory newRequest;
        newRequest.requestor = payable(msg.sender); // person who is initiating the request
        newRequest.amount = _amount;
        newRequest.message = _message;
        newRequest.blockTime = block.timestamp;
        if (names[msg.sender].hasName) {
            newRequest.name = names[msg.sender].name;
        }
        requests[user].push(newRequest); // pushing it to other person's requests
    }

    function createRequestExe(
        address requestor,
        address user,
        uint256 _amount,
        string memory _message
    ) public {
        // TODO: change
        request memory newRequest;
        newRequest.requestor = payable(requestor); // person who is initiating the request
        newRequest.amount = _amount;
        newRequest.message = _message;
        newRequest.blockTime = block.timestamp;
        if (names[msg.sender].hasName) {
            newRequest.name = names[msg.sender].name;
        }
        requests[user].push(newRequest); // pushing it to other person's requests
    }

    //Pay a Request

    function payRequest(uint256 _request) public payable {
        require(_request < requests[msg.sender].length, "No Such Request");

        request[] storage myRequests = requests[msg.sender];
        request storage payableRequest = myRequests[_request];

        uint256 toPay = payableRequest.amount * 1000000000000000000;
        require(msg.value == (toPay), "Pay Correct Amount");

        payableRequest.requestor.transfer(toPay);

        addHistory(
            msg.sender,
            payableRequest.requestor,
            payableRequest.amount,
            payableRequest.message,
            payableRequest.blockTime = block.timestamp
        );

        myRequests[_request] = myRequests[myRequests.length - 1];
        myRequests.pop();
    }

    function addHistory(
        address sender,
        address receiver,
        uint256 _amount,
        string memory _message,
        uint256 _blockTime
    ) private {
        sendReceive memory newSend;
        newSend.action = "Send";
        newSend.amount = _amount;
        newSend.message = _message;
        newSend.otherPartyAddress = receiver;
        newSend.blockTime = _blockTime;
        if (names[receiver].hasName) {
            newSend.otherPartyName = names[receiver].name;
        }
        history[sender].push(newSend);

        sendReceive memory newReceive;
        newReceive.action = "Receive";
        newReceive.amount = _amount;
        newReceive.message = _message;
        newReceive.otherPartyAddress = sender;
        newReceive.blockTime = _blockTime;
        if (names[sender].hasName) {
            newReceive.otherPartyName = names[sender].name;
        }
        history[receiver].push(newReceive);
    }

    function getMyRequests(address _user)
        public
        view
        returns (
            address[] memory,
            uint256[] memory,
            string[] memory,
            string[] memory,
            uint256[] memory
        )
    {
        address[] memory addrs = new address[](requests[_user].length);
        uint256[] memory amnt = new uint256[](requests[_user].length);
        string[] memory msge = new string[](requests[_user].length);
        string[] memory nme = new string[](requests[_user].length);
        uint256[] memory time = new uint256[](requests[_user].length);

        for (uint256 i = 0; i < requests[_user].length; i++) {
            request storage myRequests = requests[_user][i];
            addrs[i] = myRequests.requestor;
            amnt[i] = myRequests.amount;
            msge[i] = myRequests.message;
            nme[i] = myRequests.name;
            time[i] = myRequests.blockTime;
        }

        return (addrs, amnt, msge, nme, time);
    }

    //Get all historic transactions user has been apart of

    function getMyHistory(address _user)
        public
        view
        returns (sendReceive[] memory)
    {
        return history[_user];
    }

    function getMyName(address _user) public view returns (userName memory) {
        return names[_user];
    }
}
