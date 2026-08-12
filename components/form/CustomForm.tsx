"use client";

import React from "react";
import {
  useForm,
  DefaultValues,
  Path,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
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

export interface FieldConfig<T extends FieldValues> {
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

export interface CustomFormProps<T extends FieldValues> {
  schema: z.ZodSchema<T>;
  defaultValues?: DefaultValues<T>;
  onSubmit: (values: T) => void;
  fields: FieldConfig<T>[];
  submitText?: string;
  disabled?: boolean;
  resetOnSubmit?: boolean;
  hideSubmitButton?: boolean;
  children?: React.ReactNode;
  className?: string;
  form?: UseFormReturn<T>;
}

/* ---------------- Component ---------------- */

export function CustomForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  fields,
  submitText = "Submit",
  disabled,
  resetOnSubmit = false,
  hideSubmitButton = false,
  children,
  className = "space-y-6",
  form: externalForm,
}: CustomFormProps<T>) {
  const internalForm = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const form = externalForm || internalForm;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(values);
          if (resetOnSubmit) {
            form.reset();
          }
        })}
        className={className}
      >
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

        {children}

        {!hideSubmitButton && (
          <Button
            type="submit"
            variant={"dark"}
            disabled={disabled}
            className="w-full"
          >
            {submitText}
          </Button>
        )}
      </form>
    </Form>
  );
}
