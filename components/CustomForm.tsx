'use client'

import {zodResolver} from '@hookform/resolvers/zod'
import {Path, useForm} from'react-hook-form'
import {z} from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
import { Input } from './ui/input'
import { Button } from './ui/button'
import ArrayField from './ArrayField'
import PasswordField from './PasswordField'
import SelectField from './SelectField'





export interface CustomFormProps<T extends z.ZodType>{
    schema:T,
    defaultValues:z.infer<T>,
    fields:{
        name:Path<z.infer<T>>,
        label:string,
        type?:string,
        options?:{value:string,label:string}[],
        isArray?:boolean,
        placeholder?:string,
        disabled?:boolean
    }[],
    onSubmit:(values:z.infer<T>) => Promise<void>
    buttonText:string,
    isLoading: boolean,
}


export default function CustomForm<T extends z.ZodType>({
    schema,
    defaultValues,
    fields,
    onSubmit,
    buttonText,
    isLoading,
}:CustomFormProps<T>){

    
    const form = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        defaultValues,
    })
    
    const nameValue = form.watch("name" as Path<z.infer<T>>)
    
    async function handleSubmit(values:z.infer<T>){
            await onSubmit(values)
    }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            {fields.map((field) => {

                const isPriceDisabled = field.name === 'price' && nameValue == 'Free'

                if(field.isArray){
                    return <ArrayField key={field.name as string} field={field} form={form} isLoading={isLoading}/>
                }
                if(field.type=='password'){
                    return <PasswordField key={field.name as string} field={field} form={form} isLoading={isLoading}/>
                }

                if(field.options){
                    return <SelectField key={field.name as string} field={field} form={form} isLoading={isLoading}  />
                }

                return (
                    <FormField
                        key={String(field.name)}
                        control={form.control}
                        name={field.name as Path<z.infer<T>>}
                        render={({ field: fieldProps }) => (
                            <FormItem>
                                <FormLabel>{field.label}</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-blueDark border-0"
                                        disabled={field.disabled || isPriceDisabled}
                                        type={field.type}
                                        placeholder={field.placeholder || field.label}
                                        {...fieldProps}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )

            })}
            <Button variant={'light'} type="submit" disabled={isLoading}> {isLoading ? 'Loading': `${buttonText}` }</Button>
          </form>
        </Form>
      )
}


