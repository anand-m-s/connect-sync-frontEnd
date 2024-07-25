import React, { useEffect, useState } from 'react';
import Post from '../Post/post';
import { userAxios } from '../../../constraints/axios/userAxios';
import userApi from '../../../constraints/api/userApi';
import { Badge, Collapse, Divider, useMediaQuery, useTheme } from '@mui/material';
import SkeletonLoading from '../../common/skeltonLoading';
import { Parallax } from 'react-parallax';
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSelector } from 'react-redux';
import Navbar from '../Navbar/Navbar';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
// import GradientLoader from '../../common/GradientCircularProgress';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Button, IconButton } from '@mui/material';
import Notifications from '../notification/Notification';
import { useOnlineUsers } from '../../../context/OnlineUsers';

function Feed() {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const newPost = useSelector((state) => state.userAuth.newPost);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [checked, setChecked] = useState(false)
  const { notificationCount, notification } = useOnlineUsers()

  const fetchData = async () => {
    try {
      await new Promise(res => setTimeout(res, 500));
      const res = await userAxios.get(`${userApi.userFeedPost}?perPage=3&page=${page}`);
      const newData = res.data;
      setPostData((prev) => [...prev, ...newData]);
      setHasMore(newData.length > 0)
      setPage((prev) => prev + 1);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [newPost]);
  console.log(postData)
  return (
    <Box
      flex={5}
    // p={2}
    >
      {
        isSmallScreen &&
        <>
          <Box
            className='flex justify-between sticky top-0 z-20'
            sx={{
              backdropFilter: 'blur(77px)',
              // backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: adjust opacity as needed
            }}>
            <Navbar />
            <Box className='p-5'>
              <Badge badgeContent={notificationCount} color="primary">
                <NotificationsNoneIcon fontSize='medium' color={!checked ? 'disabled' : 'error'} onClick={() => setChecked(prev => !prev)} />
              </Badge>
            </Box>
          </Box>
          <Collapse in={checked} className='mt-1 p-2 rounded-xl'
          >
            {checked && <Notifications loadingStates={notification} value={0} />}
          </Collapse>
        </>
      }




      <>
        {loading ? (
          <SkeletonLoading />
        ) : (
          <>
            {postData.length < 1 ? (<Box sx={{ background: theme.palette.home.main, marginTop: isSmallScreen ? '2rem' : '7rem' }} className=" m-3 flex flex-col items-center justify-center  gap-6 py-12 text-center my-7 rounded-3xl ">
              <Box className="max-w-md space-y-4">
                <Typography variant="h4" className="text-3xl font-bold tracking-tight" color={theme.palette.home.text}>
                  Welcome to Mindful Moments!
                </Typography>
                <Typography color={theme.palette.home.text}>
                  Explore a world of guided meditations and find your inner peace.
                </Typography>
                {/* <Box className="flex flex-col items-center justify-center sm:flex-row">
                <Button
                  component={RouterLink}
                  to="/meditation"
                  variant='text'
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  Start Meditating
                </Button>
              </Box> */}
              </Box>
              <Box className="flex flex-col items-center gap-2">
                {/* <MedalIcon className="h-16 w-16 text-gray-400" /> */}
                <Typography color={theme.palette.home.text}>
                  Looks like you haven't followed anyone yet. Follow someone to see their posts.
                </Typography>
              </Box>
            </Box>) : (
              <InfiniteScroll
                dataLength={postData.length}
                next={fetchData}
                hasMore={hasMore}
                loader={<h4>Loading...</h4>}
                // loader={<GradientLoader/>}        
                endMessage={
                  <p style={{ textAlign: 'center' }}>
                    <b>Yay You have seen it all</b>
                  </p>
                }
              >
                {postData.map((post, i) => (
                  <Box
                    className={isSmallScreen ? 'px-2' : 'mt-20'}
                  >
                    <Parallax
                      key={i}
                      blur={{ min: 0, max: 15 }}
                      bgImage={post.imageUrl[0]}
                      bgImageAlt={post.description}
                      strength={-400}
                      bgImageStyle={{ backgroundSize: 'cover', opacity: '1' }}
                      // style={{ margin: '4.8rem 0', borderRadius: '1rem' }}
                      className={`mb-4 ${isSmallScreen ? 'mt-5' : ''}`}
                      style={{
                        // margin: '4.8rem 0',
                        // padding:'4rem',
                        borderRadius: '1rem'
                      }}
                    >
                      <div className={`mt-7 mb-7 ${isSmallScreen ? '' : 'ml-5'}`} key={post._id}>
                        <Post
                          comments={post.comments}
                          likes={post.likedUsers}
                          userId={post.userId}
                          postId={post._id}
                          userName={post.userName}
                          profilePic={post.profilePic}
                          imageUrl={post.imageUrl}
                          location={post.location}
                          description={post.description}
                          saved={post.isSaved}
                          verifiedExp={post.verifiedExp}
                        />
                      </div>
                    </Parallax>
                  </Box>
                ))}
              </InfiniteScroll>
            )

            }

          </>

        )}
      </>


    </Box>
  );
}

export default Feed;


