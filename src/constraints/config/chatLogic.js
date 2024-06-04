export const getSender=(userId,users)=>{
    return users[0]._id === userId ? users[1].userName:users[2].userName;
}
export const getSenderFull=(userId,users)=>{
    return users[0]._id === userId ? users[1]:users[2];
}