import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    id:"",
    name:"",
    email:"",
    isCollapsed:false,
    isAuth:false
}

const adminSlice = createSlice({
    name:'admin',
    initialState,
    reducers:{
        setAdmin: (state,action) => {
            state.id = action.payload.id
            state.name = action.payload.name
            state.email = action.payload.email
            state.isAuth = true
        },
        adminLogout:(state) => {
            state.id = ""
            state.name = ""
            state.email = ""
            state.isAuth = false
        },
        setCollapsed:(state,action) => {
            state.isCollapsed = action.payload 
        },

    }
})

export const {setAdmin,adminLogout,setCollapsed} = adminSlice.actions
export default adminSlice.reducer
