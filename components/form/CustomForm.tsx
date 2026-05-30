"use client";

import React from "react";
import { useForm, DefaultValues, Path, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/* ---------------- Types ---------------- */

interface FieldConfig<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  disabled?: boolean;
  component?: React.ComponentType<{
    value: T[Path<T>];
    onChange: (...event: unknown[]) => void;
    onBlur: () => void;
    name: Path<T>;
    ref: React.RefCallback<HTMLInputElement>;
    placeholder?: string;
    disabled?: boolean;
  }>;
}

interface CustomFormProps<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  defaultValues?: DefaultValues<T>;
  onSubmit: (values: T) => void;
  fields: FieldConfig<T>[];
  submitText?: string;
  disabled?: boolean;
}

/* ---------------- Component ---------------- */

export function CustomForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  fields,
  submitText = "Submit",
  disabled,
}: CustomFormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: rhfField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  {field.component ? (
                    <field.component
                      {...rhfField}
                      placeholder={field.placeholder}
                      disabled={field.disabled}
                    />
                  ) : (
                    <Input
                      {...rhfField}
                      type={field.type ?? "text"}
                      placeholder={field.placeholder}
                      disabled={field.disabled}
                    />
                  )}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}

        <Button
          type="submit"
          variant={"dark"}
          disabled={disabled}
          className="w-full"
        >
          {submitText}
        </Button>
      </form>
    </Form>
  );
}
