import { LoginSchema, RegisterSchema } from "@/validator/AuthSchema";
import { z } from "zod";



export type LoginData = z.infer<typeof LoginSchema>
export type RegisterData = z.infer<typeof RegisterSchema>

export interface VerifyEmailData {
    token:string,
    email:string
}

export interface ResendVerifyEmailData {
    email:string
}

export interface ForgotPasswordData {
    email:string
}

export interface VerifyOtpData{
    otp:string,
    email:string
}

export interface ResendOtpData{
    email:string
}

export interface ResetPasswordData {
    email:string,
    password:string
    resetPasswordToken?:string
}

export interface LogoutData {
    refreshToken:string
}

export interface GoogleAuthData{
    idToken:string
}

export interface GithubAuthData{
    access_token:string,
    githubId:string,
    githubUsername:string,
    name:string,
    email:string,
    image:string
}