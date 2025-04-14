/** @format */

//react-hook-form ⬅️ 연결 ⬅️ @hookform/resolvers/zod ⬅️ zod
//React Hook Form과 Zod를 연결해주는 브릿지 라이브러리

import { zodResolver } from "@hookform/resolvers/zod";
import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProps,
  FormProvider,
  SubmitHandler,
  UseFormProps,
  UseFormReturn,
  useForm,
  useFormContext,
} from "react-hook-form";

import { useSelector } from "react-redux";
import { RootState } from "@/store"; // store.ts 에서 타입 추출했을 경우
import { Label } from "./label";

import { ZodType, z } from "zod";
import styles from "./css/form.module.css";
import { cn } from "@/utils/cn";

// . 제네릭 타입 파라미터
// TFieldValues:
// 이 제네릭 타입 파라미터는 폼 데이터의 형태를 정의합니다. 기본값으로 FieldValues가 설정되어 있는데, 이는 폼에서 다룰 수 있는 데이터의 형태입니다.
// 예를 들어, TFieldValues는 { email: string, password: string }와 같은 형태일 수 있습니다. 이 데이터는 React Hook Form에서 폼 필드를 관리하는 데 사용됩니다.

// TName:
// 이 제네릭은 TFieldValues의 필드 이름을 나타냅니다. TName은 TFieldValues 객체의 키이어야 합니다. 기본값으로 FieldPath<TFieldValues>가 사용됩니다.
// FieldPath는 주어진 TFieldValues 타입에서 가능한 **경로(필드 이름)**를 추출하는 유틸리티 타입입니다.
// 예를 들어, TFieldValues가 { email: string, password: string }라면 TName은 email 또는 password와 같은 값을 가질 수 있습니다.
type FormProps<TFormValues extends FieldValues, Schema> = {
  onSubmit: SubmitHandler<TFormValues>;
  schema: Schema;
  className?: string;
  children: (methods: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: UseFormProps<TFormValues>;
  id?: string;
};

type FormItemContextValue = {
  id: string;
};

const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};
const FormField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("form-item", className)} {...props} />;
});
FormItem.displayName = "FormItem";

//  { isTouched: true, error: { message: "필수 항목입니다." } }

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext || {};

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

//

const FormLabel = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={cn(error && "text-destructive", className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ComponentRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } =
    useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn("text-[0.8rem] text-muted-foreground", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

const Form = <
  Schema extends ZodType<any, any, any>,
  TFormValues extends FieldValues = z.infer<Schema>,
>({
  onSubmit,
  children,
  className,
  options,
  id,
  schema,
}: FormProps<TFormValues, Schema>) => {
  const form = useForm({ ...options, resolver: zodResolver(schema) });
  return (
    <FormProvider {...form}>
      <form
        className={cn("form", className)}
        onSubmit={form.handleSubmit(onSubmit)}
        id={id}
      >
        {children(form)}
      </form>
    </FormProvider>
  );
};

export {
  useFormField,
  FormProvider,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
  FormField,
};
