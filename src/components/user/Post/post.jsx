import React from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { Box, CardMedia, Divider, useTheme } from '@mui/material';

function Post({ userName, profilePic, imageUrl, location, description }) {
    const theme = useTheme();

    return (
        <Box className='flex justify-center items-center'>
            <Card sx={{ marginBottom: 3, width: { xs: '90%', sm: '80%', md: '90%' } }} elevation={1}>
                <CardHeader
                    avatar={
                        <Avatar src={profilePic} sx={{ bgcolor: "skyblue" }} aria-label="recipe">
                            {userName.charAt(0)}
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={userName}
                    subheader={location}
                />
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        padding: '10px',
                        height: { xs: '200px', sm: '250px', md: '400px' }, // Responsive heights
                        overflow: 'hidden',

                    }}
                >
                    <CardMedia
                        component="img"
                        image={imageUrl[0]} // Assuming imageUrl is an array
                        alt="Post image"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain' // Ensures the image covers the box while maintaining aspect ratio
                        }}
                    />
                </Box>
                <Divider/>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        <Typography>
                            {userName}
                        </Typography>{description}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                        <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                        <ShareIcon />
                    </IconButton>
                </CardActions>
            </Card>
        </Box>
    );
}

export default Post;