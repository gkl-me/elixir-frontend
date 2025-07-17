'use client'

import { Path, useForm } from "react-hook-form";
import { CustomFormProps } from "./CustomForm";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { z } from "zod";

export default function SelectField<T extends z.ZodType>({
    field,
    form,
    isLoading,
}:{
    field:CustomFormProps<T>['fields'][0],
    form:ReturnType<typeof useForm>,
    isLoading: boolean,
}){

    return (
        <FormField
            control={form.control}
            name={field.name as Path<z.infer<T>>}
            render={({field:fieldProps}) => (
                <FormItem>
                    <FormLabel>{field.label}</FormLabel>
                    <FormControl>
                        <Select
                          disabled={isLoading}
                          onValueChange={fieldProps.onChange}
                          defaultValue={fieldProps.value}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={field.label}/>
                            </SelectTrigger>
                            <SelectContent>
                                {field?.options?.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
            )}
        />
    )
}