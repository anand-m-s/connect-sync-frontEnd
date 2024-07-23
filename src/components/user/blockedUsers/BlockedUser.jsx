import { Card, CardHeader, CardContent, Avatar, Button, Typography, Box } from '@mui/material';
import { userAxios } from '../../../constraints/axios/userAxios';
import userApi from '../../../constraints/api/userApi';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export default function BlockedUsersList() {
    const [blockedUsers, setBlockedUsers] = useState([])

    const fetchBlockedUsers = async () => {
        try {
            const res = await userAxios.get(userApi.getAllBLockedUsers)
            setBlockedUsers(res.data.blockedUsers)
        } catch (error) {
            console.error('Error:', error.message);
            toast.error(error.response.data.error);
        }
    }

    useEffect(() => {
        fetchBlockedUsers()
    }, [])

    const handleUnblockUser = async (id) => {
        try {
            const res = await userAxios.put(`${userApi.unblockUser}?id=${id}`)
            console.log(res)
            if (res.status == 200) {
                toast.info(res.data.message)
                setBlockedUsers((prev) => prev.filter((el) => el._id !== id))
            }
        } catch (error) {
            console.error('Error:', error.message);
            toast.error(error.response.data.error);
        }
    }

    return (
        <Box flex={5} padding={6}>
            <Box className="mb-8 shadow-sm p-4">
                <Typography variant="h4" className="text-3xl font-bold">Blocked Users</Typography>
            </Box>
            <Card className="w-full max-w-md mx-auto" elevation={0}>
                <CardHeader
                    className="flex items-center justify-between"
                />
                <CardContent className="space-y-4">
                    {blockedUsers.length < 1 && <Typography variant="body1" className="font-medium">No user blocked yet! :)</Typography>}
                    {blockedUsers.map((user) => (
                        <Box key={user._id} className="flex items-center justify-between">
                            <Box className="flex items-center gap-4">
                                <Avatar alt={user.userName} src={user.profilePic}>
                                    CN
                                </Avatar>
                                <Box>
                                    <Typography variant="body1" className="font-medium">{user.userName}</Typography>
                                    <Typography variant="body2" className="text-sm text-muted-foreground">{user.username}</Typography>
                                </Box>
                            </Box>
                            <Button variant="contained" color='error' size="small" onClick={() => handleUnblockUser(user._id)}>
                                Unblock
                            </Button>
                        </Box>
                    ))}
                </CardContent>
            </Card>
        </Box>
    );
}
