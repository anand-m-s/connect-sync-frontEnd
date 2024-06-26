export const getSender = (userId, users) => {
  return users[0]._id === userId ? users[1].userName : users[0].userName;
}
export const getSenderProfilePic = (userId, users) => {

  return users[0]._id === userId ? users[1].profilePic : users[0].profilePic;
}
export const getSenderFull = (userId, users) => {
  return users[0]._id === userId ? users[1] : users[0];
}

export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};
export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};



export const isOnline = (onlineUsers, userName) => {  
  const userFound = onlineUsers.find(user => user.userName === userName);
  return userFound !== undefined;
}

