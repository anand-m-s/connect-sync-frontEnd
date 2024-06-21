import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo') || "")
        : null,
    posts: [],
    newPost: null,

};

const userAuthSlice = createSlice({
    name: "userAuth",
    initialState,
    reducers: {
        setUserCredentials: (state, action) => {
            // console.log(action.payload)
            // console.log(action.payload.user)
            state.userInfo = action.payload.user
            localStorage.setItem('userInfo', JSON.stringify(action.payload.user))
            localStorage.setItem('userToken', action.payload.token)
        },
        logout: (state) => {
            state.userInfo = null
            state.posts = []
            localStorage.removeItem('userInfo')
            localStorage.removeItem('userToken')

        },
        setUserPosts: (state, action) => {
            state.posts = action.payload;
        },
        setEditedUserCredentials: (state, action) => {
            // console.log(action.payload)
            state.userInfo = action.payload
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        },
        addUserPost: (state, action) => {
            state.newPost = action.payload;
        },
        resetNewPost: (state) => {
            state.newPost = null;
        },

    }
})

export const { setUserCredentials, logout, setUserPosts, setEditedUserCredentials, addUserPost, resetNewPost

 } = userAuthSlice.actions
export default userAuthSlice.reducer