import React, { useEffect, useState } from 'react'
import Post from '../Post/post'
import Box from '@mui/material/Box';
import { userAxios } from '../../../constraints/axios/userAxios';
import userApi from '../../../constraints/api/userApi';
import { Divider } from '@mui/material';
import SkeletonLoading from '../../common/skeltonLoading';

function Feed() {
  const [postData, setPostData] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const res = await userAxios.get(userApi.userFeedPost);
      setPostData(res.data);
      await new Promise(res=>setTimeout(()=>{res()},900))
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData()
  }, [])
  return (
    <Box className=''
      flex={5}
      p={2}
    >
      <div className='p-6'>

      </div>
      <Divider sx={{ margin: 1 }} />
      {loading ? (<SkeletonLoading />) : (
        postData.map((post) => (
          <Post
            key={post._id}
            userName={post.userName}
            profilePic={post.profilePic}
            imageUrl={post.imageUrl}
            location={post.location}
            description={post.description}
          />
        ))
      )}

    </Box>
  )
}

export default Feed