import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    id:"",
    name:"",
    email:"",
    subscriptionId:"",
    subscriptionStatus:""
}

const useSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser:(state,action) => {
            state.id = action.payload.id
            state.name = action.payload.name
            state.email = action.payload.email
            state.subscriptionId = action.payload.subscriptionId
            state.subscriptionStatus = action.payload.subscriptionStatus
        },
        userLogout:(state) => {
            state.id = ""
            state.email = ""
            state.name = ""
            state.subscriptionId = ""
            state.subscriptionStatus = ""
        }
    }
})


export const {setUser,userLogout} = useSlice.actions
export default useSlice.reducer