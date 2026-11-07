import * as React from "react";
import { Check, CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, onBlur, onChange, ...props }, ref) => {
    const [validation, setValidation] = React.useState<"valid" | "invalid" | undefined>();
    const validate = (element: HTMLInputElement) => {
      if (type !== "email" && type !== "url") return;
      setValidation(element.value ? (element.validity.valid ? "valid" : "invalid") : undefined);
    };
    return (
      <span className="input-shell relative block w-full">
      <input
        type={type}
        className={cn(
          "forma-input flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
          validation && "pr-10",
        )}
        ref={ref}
        {...props}
        aria-invalid={props["aria-invalid"] ?? (validation === "invalid" ? true : undefined)}
        onBlur={(event) => { validate(event.currentTarget); onBlur?.(event); }}
        onChange={(event) => { if (validation) validate(event.currentTarget); onChange?.(event); }}
      />
      {validation && <span aria-hidden="true" className={cn("validation-icon pointer-events-none absolute right-3 top-1/2 -translate-y-1/2", validation === "valid" ? "text-success" : "text-destructive")}>
        {validation === "valid" ? <Check className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}
      </span>}
      </span>
    );
  },
);
Input.displayName = "Input";

export { Input };
