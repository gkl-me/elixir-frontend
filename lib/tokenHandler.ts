
import { ITokenPayload } from '@/types/types'
import {jwtVerify} from 'jose'


const access_secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET)
const refresh_secret = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET)


export async function verifyAccessToken(token?:string){
    try {

        if(!token) return null

        const {payload} = await jwtVerify<ITokenPayload>(token,access_secret)
        return payload
    } catch {
        return null
    }
}

export async function verifyRefreshToken(token?:string){
    try {

        if(!token) return null
        
        const {payload} = await jwtVerify<ITokenPayload>(token,refresh_secret)
        return payload

    } catch {
        return null
    }
}