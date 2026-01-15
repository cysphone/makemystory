import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={cn(
                    "w-full rounded-xl border border-rose-200 bg-white/50 px-4 py-3 text-foreground placeholder:text-rose-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none",
                    className
                )}
                {...props}
            />
        );
    }
);

Textarea.displayName = "Textarea";

export { Textarea };
