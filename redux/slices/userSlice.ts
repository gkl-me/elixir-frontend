import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    id:"",
    name:"",
    email:"",
}

const useSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser:(state,action) => {
            state.id = action.payload.id
            state.name = action.payload.name
            state.email = action.payload.email
        },
        userLogout:(state) => {
            state.id = ""
            state.email = ""
            state.name = ""
        }
    }
})


export const {setUser,userLogout} = useSlice.actions
export default useSlice.reducer