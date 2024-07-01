import { Avatar, Box, Typography } from "@mui/material";
import { cn } from "../../../utils/cn";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { differenceInDays, format, isToday, isYesterday } from "date-fns";

const LoaderCore = ({ loadingStates, value = 0 }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isToday(date)) {
            return format(date, 'HH:mm');
        }
        if (isYesterday(date)) {
            return 'yesterday';
        }
        const daysAgo = differenceInDays(new Date(), date);
        return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    };

    return (
        <Box
            className="flex relative justify-start max-w-xl mx-auto flex-col rounded-lg"
            sx={{
                boxShadow: 24,
                padding: 1,
                maxHeight: '300px', 
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                    width: '4px',
                    borderRadius: '1px',
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '8px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#555',
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f1f1',
                    borderRadius: '8px',
                },
            }}
        >
            {loadingStates.length === 0 ? (
                <Typography variant="body1" color="text.secondary" className="text-center">
                    No notifications yet
                </Typography>
            ) : (
                loadingStates.map((loadingState, index) => (
                    <motion.div
                        key={index}
                        className={cn("text-left flex gap-2 mb-4 p-1")}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                        <Box sx={{ display: 'flex', gap: 2, mb: 0, width: '100%' }}>
                            <Avatar src={loadingState.follower.profilePic}>{loadingState.follower.userName}</Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                                <Box className="flex justify-between items-center">
                                    <Typography variant="subtitle2" component={Link} to={`/profile?userId=${loadingState.follower._id}`}>
                                        {loadingState.follower.userName.split(' ')[0] || loadingState.follower.userName}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ marginLeft: 'auto' }}>
                                        {formatDate(loadingState.updatedAt)}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" className="flex justify-start">
                                    {loadingState.content}
                                </Typography>
                            </Box>
                        </Box>
                    </motion.div>
                ))
            )}
        </Box>
    );
};

export default LoaderCore;

