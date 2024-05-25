import {configureStore} from '@reduxjs/toolkit'
import userAuthReducer from './slices/userAuthSlice'
import adminAuthReducer from './slices/adminAuthSlice'

const store = configureStore({
    reducer:{
        userAuth:userAuthReducer,
        adminAuth:adminAuthReducer,
    },
    devTools:true
})



export default store