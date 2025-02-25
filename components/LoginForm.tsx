'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import {Path, useForm} from'react-hook-form'
import {z} from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'




interface LoginFormProps<T extends z.ZodType>{
    schema:T,
    defaultValues:z.infer<T>,
    fields:{name:keyof z.infer<T>,label:string,type?:string}[],
    onSubmit:(values:z.infer<T>) => Promise<void>
    buttonText:string,
    isLoading: boolean,
}


export default function LoginForm<T extends z.ZodType>({
    schema,
    defaultValues,
    fields,
    onSubmit,
    buttonText,
    isLoading,
}:LoginFormProps<T>){

    
    const form = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        defaultValues,
    })
    
    
    async function handleSubmit(values:z.infer<T>){
            await onSubmit(values)
    }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {fields.map((field) => (
                <FormField
                    key={String(field.name)}
                    control={form.control}
                    name={field.name as Path<z.infer<T>>}
                    render={({field:fieldProps}) => (
                        <FormItem>
                            <FormLabel>{field.label}</FormLabel>
                            <FormControl>
                                <Input disabled={isLoading} type={field.type} placeholder={field.name as string} {...fieldProps}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
            ))}
            <Button type="submit" disabled={isLoading}>{buttonText}</Button>
          </form>
        </Form>
      )
}