import React, { useEffect, useState } from 'react';
import Post from '../Post/post';
import Box from '@mui/material/Box';
import { userAxios } from '../../../constraints/axios/userAxios';
import userApi from '../../../constraints/api/userApi';
import { Divider } from '@mui/material';
import SkeletonLoading from '../../common/skeltonLoading';
import { Parallax } from 'react-parallax';


function Feed() {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await userAxios.get(userApi.userFeedPost);
      setPostData(res.data);
      await new Promise(res => setTimeout(res,900));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
 

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box
      // sx={{ background: '#F3F3F3' }}
      flex={5}
      // p={.1}
      p={4}

    >
      {loading ? (
        <SkeletonLoading />
      ) : (
        postData.map((post) => (
          <Parallax
            key={post._id}
            blur={{ min: 0, max: 15 }}
            bgImage={post.imageUrl[0]}
            bgImageAlt={post.description}
            strength={-400}
            bgImageStyle={{ backgroundSize: 'cover', opacity: '1' }}
            // style={{ margin: '4.8rem 0', borderRadius: '1rem' }}
            style={{ 
              margin: '4.8rem 0',
                // padding:'4rem',
               borderRadius: '1rem' }}            
          >
            <div className="p-2 mt-9 ml-5  " key={post._id}>
              <Post
                postId={post._id}
                userName={post.userName}
                profilePic={post.profilePic}
                imageUrl={post.imageUrl}
                location={post.location}
                description={post.description}
              />
            </div>
            </Parallax>
        ))
      )}
    </Box>
  );
}

export default Feed;
