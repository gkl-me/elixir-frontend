import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    id:"",
    name:"",
    email:"",
    isCollapsed:false
}

const adminSlice = createSlice({
    name:'admin',
    initialState,
    reducers:{
        setAdmin: (state,action) => {
            state.id = action.payload.id
            state.name = action.payload.name
            state.email = action.payload.email
        },
        logout:(state) => {
            state.id = ""
            state.name = ""
            state.email = ""
        },
        setCollapsed:(state,action) => {
            state.isCollapsed = action.payload 
        },

    }
})

export const {setAdmin,logout,setCollapsed} = adminSlice.actions
export default adminSlice.reducer
