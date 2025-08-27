'use client'

import { Path, useForm } from "react-hook-form"
import { CustomFormProps } from "./CustomForm"
import { useState } from "react"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Eye, EyeOff } from "lucide-react"
import { z } from "zod"

export default function PasswordField<T extends z.ZodType>({
    field,
    form,
    isLoading,
}:{
    field:CustomFormProps<T>['fields'][0],
    form:ReturnType<typeof useForm>,
    isLoading: boolean,
}){

    const [showPassword,setShowPassword] = useState(false)

    return (
        <FormField 
            control={form.control}
            name={field.name as Path<z.infer<T>>}
            render={({field:fieldProps}) => (
                <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <div className="relative">
                    <FormControl>
                        <Input 
                            className="bg-blueDark border-0"
                            disabled={isLoading}
                            type={showPassword ? 'text':'password'}
                            placeholder={field.placeholder||field.label}
                            {...fieldProps}
                            />
                    </FormControl>
                        <Button className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-transparent hover:text-white"
                            tabIndex={-1} type="button" variant={'ghost'} size={'sm'}
                            onClick={() => {
                                setShowPassword(p => !p)
                            }}
                            >
                            {showPassword?<EyeOff size={18}/> : <Eye size={18}/>}
                        </Button>
                    </div>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}
