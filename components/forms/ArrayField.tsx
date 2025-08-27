'use client'

import {TypeOf, z} from 'zod'
import { CustomFormProps } from './CustomForm'
import { FieldArray, FieldValues, Path, useFieldArray, useForm } from 'react-hook-form'
import { FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Plus, Trash } from 'lucide-react'

export default function ArrayField<T extends z.ZodType>({
    field,
    form,
    isLoading,
}:{
    field:CustomFormProps<T>['fields'][0],
    form:ReturnType<typeof useForm>,
    isLoading: boolean,
}){
    const {fields,append,remove} = useFieldArray({
        control: form.control,
        name: field.name as Path<z.infer<T>>,
    })

    return (
        <div>
            <FormLabel>{field.label}</FormLabel>
            {fields.map((item,index) => (
                <div key={item.id}>
                   <FormField
                    control={form.control}
                    name={`${field.name as string}.${index}`}
                    render={({field:fieldProps}) => (
                        <FormItem>
                            <Input 
                            className="bg-blueDark border-0"
                             disabled={isLoading} type={field.type} placeholder={field.placeholder} {...fieldProps}/>
                            <FormMessage/>
                        </FormItem>
                    )}
                   />
                   <Button type='button' variant={'destructive'} size={'icon'} onClick={() => remove(index)} disabled={isLoading} >
                     <Trash size={18}/>
                   </Button>
                </div>
            ))}
            <Button type='button' size={'sm'} onClick={() => append("" as FieldArray<FieldValues, Path<TypeOf<T>>> )} disabled={isLoading} >
                <Plus>Add {field.label}</Plus>
            </Button>
        </div>
    )
}

