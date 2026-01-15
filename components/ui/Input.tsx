import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    "w-full rounded-xl border border-rose-200 bg-white/50 px-4 py-3 text-foreground placeholder:text-rose-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all",
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";

export { Input };
