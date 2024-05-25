import {createSlice} from '@reduxjs/toolkit'

const initialState={
    adminInfo:localStorage.getItem('adminInfo')?JSON.parse(localStorage.getItem('adminInfo')||"")
    :null,
};

const adminAuthSlice = createSlice({
    name:"adminAuth",
    initialState,
    reducers:{
        setAdminCredentials:(state,action)=>{
            console.log(action.payload)
            state.adminInfo = action.payload
            localStorage.setItem('adminInfo',JSON.stringify(action.payload))
            localStorage.setItem('adminToken', action.payload.token);
        },
        logout:(state)=>{
            state.adminInfo = null      
            localStorage.removeItem('adminInfo')
            localStorage.removeItem('adminToken')

        },    
    }
})

export const {setAdminCredentials,logout,}=adminAuthSlice.actions
export default adminAuthSlice.reducer