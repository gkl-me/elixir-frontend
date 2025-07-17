'use client'

import React from 'react'
import CustomForm, { CustomFormProps } from '../forms/CustomForm'
import { UserLoginSchema } from '@/validator/user/UserAuthSchema'
import { z } from 'zod'
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from 'react-icons/fa';

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

    const handleLogin = async(data:z.infer<typeof UserLoginSchema>) => {
        console.log(data)
    }

    return (
      <div className="mx-auto mt-20 w-4/5 md:w-full max-w-md p-4 md:p-8 rounded-2xl shadow-lg bg-navy text-white">
        <h2 className="text-3xl font-bold text-center mb-8 text-purple">
          Welcome Back
        </h2>

        <CustomForm
          buttonText="Login"
          defaultValues={{
            email: '',
            password: '',
          }}
          fields={fields}
          onSubmit={handleLogin}
          schema={UserLoginSchema}
          isLoading={false}
        />

        <div className="my-6 flex items-center justify-between text-gray-400">
          <hr className="w-full border-gray-600" />
          <span className="px-3 text-sm">or</span>
          <hr className="w-full border-gray-600" />
        </div>

        <div className="flex flex-col gap-3">
          <button
            className="flex items-center justify-center gap-3 border border-gray-600 hover:bg-blueDark transition py-2 rounded-md"
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
            Sign up
          </a>
        </p>
      </div>
  )
}

export default LoginForm