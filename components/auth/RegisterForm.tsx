'use client'

import React from 'react'
import CustomForm, { CustomFormProps } from '../forms/CustomForm'
import { UserRegisterSchema } from '@/validator/user/UserAuthSchema'
import { z } from 'zod'
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from 'react-icons/fa';
import { USER_ROUTES } from '@/constants/userRoutes'
import Image from 'next/image'
import { toast } from 'sonner'
import { AxiosErrorHandler } from '@/lib/errorHandler'
import { useRegisterMutation } from '@/redux/api/auth/authApi'
import { useRouter } from 'next/navigation'

const fields:CustomFormProps<typeof UserRegisterSchema>['fields'] = [
    {
        name:'name',
        label:"Name",
        type:"text",
        placeholder:"enter your name"
    },{
        name:'email',
        label:'Email',
        type:'text',
        placeholder:"enter your email",
    },{
        name:'password',
        label:'Password',
        type:'password',
        placeholder:"enter your password",
    },{
        name:'confirmPassword',
        label:"Confirm Password",
        type:'password',
        placeholder:"enter your password"
    }
]

function RegisterForm() {

      const [register,{isLoading}] = useRegisterMutation()
      const router = useRouter()

    const handleLogin = async(data:z.infer<typeof UserRegisterSchema>) => {
        try {
          const res = await register(data).unwrap()
          console.log(res)
          router.replace('/login')
          toast.success(res.message)
        } catch (error) {
          toast.error(AxiosErrorHandler(error))
        }
    }

    return (
      <div className="mt-10 md:mt-4 mx-auto w-4/5 md:w-full max-w-md p-4 md:p-8 rounded-2xl shadow-lg bg-navy text-white">
        <div className='flex justify-center align-middle text-center gap-3'>
        <Image
            src='./elixir-logo.svg'
            height={25}
            width={25}
            alt='logo'
            className='mb-8 md:6'
        />
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-8">Register To Elixir</h2>
        </div>

        <CustomForm
          buttonText="Login"
          defaultValues={{
            name:"",
            email: '',
            password: '',
            confirmPassword:""
          }}
          fields={fields}
          onSubmit={handleLogin}
          schema={UserRegisterSchema}
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
          Already have an account?{' '}
          <a href={USER_ROUTES.LOGIN} className="text-purple hover:underline">
            Login
          </a>
        </p>
      </div>
  )
}

export default RegisterForm