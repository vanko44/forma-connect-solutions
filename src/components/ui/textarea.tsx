import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, onChange, ...props }, ref) => {
    const [length, setLength] = React.useState(String(props.defaultValue ?? "").length);
    const count = props.value !== undefined ? String(props.value).length : length;
    const ratio = props.maxLength ? count / props.maxLength : 0;
    return (
      <span className="block w-full">
      <textarea
        className={cn(
          "forma-input flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
        onChange={(event) => { setLength(event.currentTarget.value.length); onChange?.(event); }}
      />
      {props.maxLength && <span aria-hidden="true" className={cn("mt-2 block text-right text-xs font-normal tabular-nums", ratio >= 1 ? "text-destructive character-limit" : ratio >= 0.9 ? "text-warning" : "text-muted-foreground")}>
        {count} / {props.maxLength}
      </span>}
      </span>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
