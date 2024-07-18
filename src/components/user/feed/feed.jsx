  import React, { useEffect, useState } from 'react';
  import Post from '../Post/post';
  import Box from '@mui/material/Box';
  import { userAxios } from '../../../constraints/axios/userAxios';
  import userApi from '../../../constraints/api/userApi';
  import { Divider } from '@mui/material';
  import SkeletonLoading from '../../common/skeltonLoading';
  import { Parallax } from 'react-parallax';
  import InfiniteScroll from 'react-infinite-scroll-component'
import { useSelector } from 'react-redux';
  // import GradientLoader from '../../common/GradientCircularProgress';

  function Feed() {
    const [postData, setPostData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const newPost = useSelector((state) => state.userAuth.newPost);

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
    return (
      <Box
        flex={5}
        p={4}
      >
        {loading ? (
          <SkeletonLoading />
        ) : (
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
              <Parallax
                key={i}
                blur={{ min: 0, max: 15 }}
                bgImage={post.imageUrl[0]}
                bgImageAlt={post.description}
                strength={-400}
                bgImageStyle={{ backgroundSize: 'cover', opacity: '1' }}
                // style={{ margin: '4.8rem 0', borderRadius: '1rem' }}
                style={{
                  margin: '4.8rem 0',
                  // padding:'4rem',
                  borderRadius: '1rem'
                }}
              >
                <div className=" mt-9 ml-5  " key={post._id}>
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
            ))}
          </InfiniteScroll>

        )}
      </Box>
    );
  }

  export default Feed;


