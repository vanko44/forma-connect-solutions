import { cloneElement, isValidElement, type ReactNode, type ReactElement, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Keep native date/number/select controls and textarea labels outside. */
export function FormField({ label, children }: { label: string; children: ReactNode }) {
  if (isValidElement(children) && children.type === Input) {
    const input = children as ReactElement<ComponentProps<typeof Input>>;
    if (!["date", "datetime-local", "time", "file", "number"].includes(input.props.type ?? "text")) {
      return (
        <label className="floating-field">
          {cloneElement(input, {
            placeholder: input.props.placeholder || " ",
            className: cn(input.props.className, "floating-input"),
          })}
          <span className="floating-label">{label}</span>
          {input.props.placeholder && <span className="field-hint">{input.props.placeholder}</span>}
        </label>
      );
    }
  }
  return <label className="block text-xs font-bold uppercase text-muted-foreground">{label}<div className="mt-2">{children}</div></label>;
}