import { Box, IconButton, TextField, Typography, useTheme } from '@mui/material'
import React, { useState } from 'react'
import Comment from './Comment'
import { Send } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { userAxios } from '../../../constraints/axios/userAxios'
import userApi from '../../../constraints/api/userApi'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { format, isToday, differenceInDays, isYesterday } from 'date-fns';
import { useSocket } from '../../../services/socket'

function CommentSection({ postId, comments, postOwnerId }) {
    const user = useSelector((state) => state.userAuth.userInfo)
    const [newComment, setNewComment] = useState('')
    const [postComments, setPostComments] = useState([])
    const [replyText, setReplyText] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [parentId, setParentId] = useState('')
    const theme = useTheme()
    const { socket } = useSocket()

    useEffect(() => {
        setPostComments(comments)
    }, [comments])
    const handleAddComment = async () => {
        console.log('add comment')
        const commentData = {
            newComment,
            postId,
        }
        try {
            const res = await userAxios.post(userApi.addComment, commentData)
            console.log(res)
            console.log(res.data)
            console.log(res.data.post.userId._id)
            const postOwnerId = res.data.post.userId._id
            if (socket && user.id !== postOwnerId) {
                socket.emit('comment', { postId, commentedBy: user.userName, postOwnerId })
            }
            fetchAllComments()
            setNewComment('')
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    }


    const fetchAllComments = async () => {
        try {
            const res = await userAxios.get(`${userApi.loadComments}?postId=${postId}`)
            setPostComments(res.data)
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    }
    const handleAddReply = async (commentId) => {
        const replyData = {
            reply: replyText,
            commentId,
            userId: user.id,
            // parentId:parentId
        };
        try {
            const res = await userAxios.post(userApi.addReply, replyData);
            console.log(res.data)
            setReplyText('');
            setReplyingTo(null);
            setParentId('')
            fetchAllComments();
            toast.success(res.data.message)
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isToday(date)) {
            return format(date, 'HH:mm');
        }
        if (isYesterday(date)) {
            return 'yesterday'
        }
        const daysAgo = differenceInDays(new Date(), date);
        return `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
    };

    const handleReplayInput = (commentId, pId = null) => {
        console.log('inside', commentId)
        console.log(pId)
        if (replyingTo == commentId) {
            setReplyingTo(null)
        } else {
            setReplyingTo(commentId)
            setParentId(pId)
        }
    }
    // console.log(postComments)
    return (
        <Box
        >
            <Box
                sx={{
                    //   marginTop: '1rem',
                    marginBottom: '5rem'
                }} className='px-11 py-1'>
                {postComments.map((comment) => (
                    <Box key={comment._id} className='shadow-sm'>
                        <Comment
                            avatarSrc={comment.userId.profilePic || "/placeholder.svg"}
                            fallback={comment.userId.userName.charAt(0)}
                            name={comment.userId.userName}
                            time={formatDate(comment.createdAt)}
                            content={comment.content}
                            onReply={() => handleReplayInput(comment._id)}
                            userId={comment.userId._id}
                            postOwnerId={postOwnerId}
                            commentId={comment._id}
                            fetchAgain={fetchAllComments}

                        />
                        {comment.replies && comment.replies.map((rep) => (
                            <Box key={rep._id} sx={{ ml: 3, mb: 2 }}>
                                <Comment
                                    avatarSrc={rep.userId.profilePic || "/placeholder.svg"}
                                    fallback={rep.userId.userName.charAt(0)}
                                    name={rep.userId.userName}
                                    time={formatDate(rep.createdAt)}
                                    content={rep.reply}
                                    onReply={() => handleReplayInput(comment._id, rep._id)}
                                    userId={rep.userId._id}
                                    postOwnerId={postOwnerId}
                                    commentId={rep._id}
                                    fetchAgain={fetchAllComments}
                                />
                            </Box>
                        ))}
                        {replyingTo === comment._id && (
                            <Box sx={{ ml: 7, mt: 2, display: 'flex', alignItems: 'center' }}>
                                <TextField
                                    onChange={(e) => setReplyText(e.target.value)}
                                    value={replyText}
                                    variant="outlined"
                                    placeholder="Add a reply..."
                                    fullWidth
                                    multiline
                                    maxRows={4}
                                    InputProps={{
                                        sx: {
                                            borderRadius: '50px',
                                            padding: '10px 15px',
                                            backgroundColor: theme.palette.background.paper,
                                            // zIndex: 1600,
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                border: `1px solid ${theme.palette.divider}`,
                                            },
                                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                        },
                                        style: {
                                            fontSize: '1rem',
                                        },
                                    }}
                                />
                                <IconButton size="large" onClick={() => handleAddReply(comment._id)}>
                                    <Send className="h-5 w-5" color='primary' />
                                </IconButton>
                            </Box>
                        )}
                    </Box>
                ))}
                {postComments.length < 1 && (
                    <Box className='p-7 text-center'>
                        <Typography variant='subtitle1'>No comments yet...</Typography>
                    </Box>
                )}


            </Box>
            <Box className="fixed bottom-0 flex backdrop-filter backdrop-blur-md p-6 w-96"
                // sx={{ border: `1px solid ${theme.palette.divider}` }}
                style={{ zIndex: 1200 }}
            >
                <Box className="flex-1">
                    <TextField
                        // onKeyDown={addComment}                        
                        onChange={(e) => setNewComment(e.target.value)}
                        value={newComment}
                        variant="outlined"
                        placeholder="Add comment..."
                        fullWidth
                        multiline
                        maxRows={4}
                        InputProps={{
                            sx: {
                                borderRadius: '50px',
                                padding: '10px 15px',
                                backgroundColor: theme.palette.background.paper,
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: `1px solid ${theme.palette.divider}`,
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.primary.main,
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: theme.palette.primary.main,
                                },
                            },
                            style: {
                                fontSize: '1rem',

                            },
                        }}
                        // sx={{ zIndex: 2400 }}
                        InputLabelProps={{
                            sx: {
                                paddingLeft: '15px',
                            },
                        }}
                    />
                </Box>
                <Box className="flex items-center gap-3 ml-3">
                    {/* <IconButton size="small">
                        <AttachFile className="h-5 w-5" />
                    </IconButton>
                    <IconButton size="small">
                        <InsertEmoticon className="h-5 w-5" />
                    </IconButton> */}
                    <IconButton size="large" onClick={handleAddComment}  >
                        <Send className="h-5 w-5" color='primary' />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    )
}

export default CommentSection