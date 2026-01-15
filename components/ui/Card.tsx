import { HTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "glass-card rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/10",
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = "Card";

export { Card };
