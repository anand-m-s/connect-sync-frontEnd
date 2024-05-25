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

import { Box, CardMedia, useTheme } from '@mui/material';

function Post() {
    const theme= useTheme()
    return (
        <Box className='flex justify-center items-center'>
            <Card sx={{ margin: 3}} elevation={1}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: "skyblue" }} aria-label="recipe">
                            D
                        </Avatar>
                    }
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title="Shrimp and Chorizo Paella"
                    subheader="September 14, 2016"
                />
                <Box className=''
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '30rem',
                    [theme.breakpoints.down('sm')]: {
                        height: '10rem', // Height for small screens (mobile devices)
                      },
                }}
                >
                    <CardMedia
                        className='bg-slate-200 '
                        component="img"
                        image="https://images.squarespace-cdn.com/content/v1/5ab926f8a9e0287fbf928015/1528770140316-QLIH41P1HKUWZL0E1U8F/IMG_0217.JPG?format=500w"
                        alt="dummy"
                        sx={{ width:'50%'}}
                    />
                </Box>

                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        This impressive paella is a perfect party dish and a fun meal to cook
                        together with your guests. Add 1 cup of frozen peas along with the mussels,
                        if you like.
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

    )
}

export default Post