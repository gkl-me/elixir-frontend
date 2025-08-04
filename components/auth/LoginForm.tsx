'use client'

import React from 'react'
import CustomForm, { CustomFormProps } from '../forms/CustomForm'
import { UserLoginSchema } from '@/validator/user/UserAuthSchema'
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from 'react-icons/fa';
import Image from 'next/image'
import useLogin from '@/hooks/auth/useLogin'
import { toast } from 'sonner';
import { AxiosErrorHandler } from '@/lib/errorHandler';
import { signIn } from 'next-auth/react';

const fields:CustomFormProps<typeof UserLoginSchema>['fields'] = [
    {
        name:'email',
        label:'Email',
        type:'text',
        placeholder:"Enter Your Email",
    },{
        name:'password',
        label:'Password',
        type:'password',
        placeholder:"Enter your password",
    }
]

function LoginForm() {

  const {handleLogin, isLoading } = useLogin()

  const handleGoogleLogin = async () => {
    try {

      signIn('google',{
        callbackUrl:'/verify/google'
      })

    } catch (error) {
      toast.error(AxiosErrorHandler(error))
    }
  }

    return (
      <div className="mx-auto mt-20 w-4/5 md:w-full max-w-md p-4 md:p-8 rounded-2xl shadow-lg bg-navy text-white">
        <div className='flex justify-center align-middle text-center gap-3'>
                <Image
                    src='./elixir-logo.svg'
                    height={25}
                    width={25}
                    alt='logo'
                    className='mb-8 md:6'
                />
                <h2 className="text-xl md:text-2xl font-semibold text-center mb-8">Welcome Back</h2>
                </div>

        <CustomForm
          buttonText="Login"
          defaultValues={{
            email: '',
            password: '',
          }}
          fields={fields}
          onSubmit={handleLogin}
          schema={UserLoginSchema}
          isLoading={isLoading}
        />

        <div className="my-6 flex items-center justify-between text-gray-400">
          <hr className="w-full border-gray-600" />
          <span className="px-3 text-sm">or</span>
          <hr className="w-full border-gray-600" />
        </div>

        <div className="flex flex-col gap-3">
          <button
            className="flex items-center justify-center gap-3 border border-gray-600 hover:bg-blueDark transition py-2 rounded-md"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="text-xl" />
            <span className="text-sm font-medium text-white">
              Continue with Google
            </span>
          </button>

          <button
            className="flex items-center justify-center gap-3 border border-gray-600 hover:bg-purpleDark transition py-2 rounded-md"
          >
            <FaGithub className="text-xl text-white" />
            <span className="text-sm font-medium text-white">
              Continue with GitHub
            </span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Don’t have an account?{' '}
          <a href="/register" className="text-purple hover:underline">
            Register
          </a>
        </p>
      </div>
  )
}

export default LoginForm