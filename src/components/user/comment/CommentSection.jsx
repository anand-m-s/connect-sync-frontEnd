import { Box, IconButton, TextField, useTheme } from '@mui/material'
import React, { useState } from 'react'
import Comment from './Comment'
import { Send } from '@mui/icons-material'
import { useSelector } from 'react-redux'
import { userAxios } from '../../../constraints/axios/userAxios'
import userApi from '../../../constraints/api/userApi'
import { toast } from 'sonner'
import { useEffect } from 'react'
import { format, isToday, differenceInDays, isYesterday } from 'date-fns';

function CommentSection({ postId }) {

    const user = useSelector((state) => state.userAuth.userInfo)
    const [newComment, setNewComment] = useState('')
    const [comments, setComments] = useState([])
    const [replyText, setReplyText] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [parentId,setParentId] = useState('')
    const theme = useTheme()


    const handleAddComment = async () => {
        console.log('add comment')
        const commentData = {
            newComment,
            postId,
            userId: user.id
        }
        try {
            const res = await userAxios.post(userApi.addComment, commentData)
            console.log(res)
            console.log(res.data)
            fetchAllMessages()
            setNewComment('')
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    }

    const fetchAllMessages = async () => {
        try {
            const res = await userAxios.get(`${userApi.loadComments}?postId=${postId}`)
            console.log(res.data)
            setComments(res.data)            
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
            parentId
        };
        try {
            const res = await userAxios.post(userApi.addReply, replyData); 
            console.log(res.data)
            setReplyText('');
            setReplyingTo(null);
            setParentId('')
            fetchAllMessages();
            toast.success(res.data.message)
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            }
        }
    };

    useEffect(() => {
        fetchAllMessages()
    }, [postId])


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

    const handleReplayInput =(commentId,pId=null)=>{
        console.log('inside',commentId)
        if(replyingTo==commentId){
            setReplyingTo(null)
            }else{
            setReplyingTo(commentId)
            setParentId(pId)
        }
    }
    console.log(comments)


    return (
        <Box        
        >
            <Box sx={{ marginTop:'1rem',marginBottom:'5rem' }} className='p-6'>
                {comments.map((comment) => (
                    <Box key={comment._id} sx={{ mb: 2 }}>
                        <Comment
                            avatarSrc={comment.userId.profilePic || "/placeholder.svg"}
                            fallback={comment.userId.userName.charAt(0)}
                            name={comment.userId.userName}
                            time={formatDate(comment.createdAt)}
                            text={comment.content}
                            onReply={()=>handleReplayInput(comment._id)}
                            // onReply={() => setReplyingTo(comment._id)}
                        />
                        {comment.replies && comment.replies.map((rep) => (
                            <Box key={rep._id} sx={{ ml: 7, mb: 2 }}>
                                <Comment
                                    avatarSrc={rep.userId.profilePic || "/placeholder.svg"}
                                    fallback={rep.userId.userName.charAt(0)}
                                    name={rep.userId.userName}
                                    time={formatDate(rep.createdAt)}
                                    text={rep.reply}
                                    onReply={()=>handleReplayInput(comment._id,rep._id)}
                                />
                            </Box>
                        ))}
                        {replyingTo === comment._id && (
                            <Box sx={{ ml: 7, mt: 1, display: 'flex', alignItems: 'center' }}>
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


            </Box>
            <Box className="fixed bottom-0 flex backdrop-filter backdrop-blur-md p-6 w-96 rounded-md"
            // sx={{ border: `1px solid ${theme.palette.divider}` }}
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