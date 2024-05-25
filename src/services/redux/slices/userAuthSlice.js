import {createSlice} from '@reduxjs/toolkit'


const initialState={
    userInfo:localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')||"")
    :null,
    posts:[]
};

const userAuthSlice = createSlice({
    name:"userAuth",
    initialState,
    reducers:{
        setUserCredentials:(state,action)=>{
            // console.log(action.payload)
            // console.log(action.payload.user)
            state.userInfo = action.payload.user
            localStorage.setItem('userInfo',JSON.stringify(action.payload.user))
            localStorage.setItem('userToken', action.payload.token)
        },
        logout:(state)=>{
            state.userInfo = null
            state.posts=[]
            localStorage.removeItem('userInfo')
            localStorage.removeItem('userToken')

        },
        setUserPosts:(state,action)=>{           
            state.posts = action.payload;
        },
        setEditedUserCredentials:(state,action)=>{
            // console.log(action.payload)
            state.userInfo= action.payload
            localStorage.setItem('userInfo',JSON.stringify(action.payload))
        }
    }
})

export const {setUserCredentials,logout,setUserPosts,setEditedUserCredentials}=userAuthSlice.actions
export default userAuthSlice.reducer