export const isFollowing=(userId,followingStatus)=>{
    return followingStatus.includes(userId);
}