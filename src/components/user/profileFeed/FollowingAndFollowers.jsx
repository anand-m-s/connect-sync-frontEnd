import React, { useMemo } from 'react';
import { Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import { isFollowing } from '../../../constraints/config/followLogic';
import { userAxios } from '../../../constraints/axios/userAxios';
import userApi from '../../../constraints/api/userApi';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const UserList = ({ users, currentUserFollowing, onFollowChange }) => {
    const followingStatus = useMemo(() => {
        return users.map(user => ({
            ...user,
            isFollowing: isFollowing(user._id, currentUserFollowing),
        }));
    }, [users, currentUserFollowing]);

    const currentUser = useSelector((state) => state.userAuth.userInfo);

    const onFollowClick = async (userId) => {
        try {
            const currentlyFollowing = isFollowing(userId, currentUserFollowing);
            const res = await userAxios.post(`${userApi.followUser}`, { userIdToToggle: userId });
            toast.info(res.data.message);
            onFollowChange(userId, !currentlyFollowing);
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    }

    return (
        <Box sx={{ maxHeight: 400, overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
            <List>
                {followingStatus.map((user) => (
                    <ListItem key={user._id}>
                        <ListItemAvatar>
                            <Avatar src={user.profilePic} />
                        </ListItemAvatar>
                        <ListItemText primary={user.userName} />
                        {currentUser.id !== user._id && (
                            <Button
                                variant="text"
                                color={user.isFollowing ? 'error' : 'info'}
                                size='small'
                                onClick={() => onFollowClick(user._id)}
                            >
                                {user.isFollowing ? 'Unfollow' : 'Follow'}
                            </Button>
                        )}
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default UserList;

