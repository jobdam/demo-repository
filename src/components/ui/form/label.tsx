/** @format */

import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";

import { cn } from "@/utils/cn";
import styles from "./css/label.module.css";

const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(styles.label, className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
