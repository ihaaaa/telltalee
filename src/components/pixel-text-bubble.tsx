import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function PixelTextBubble({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative bg-white text-black p-4 border-4 border-double border-black",
        "after:content-[''] after:absolute after:left-1/2 after:w-0 after:h-0 after:-bottom-3 after:-translate-x-1/2 after:border-l-[10px] after:border-l-transparent after:border-r-[10px] after:border-r-transparent after:border-t-[10px] after:border-t-black",
        className
      )}
      {...props}
    >
      <p className="text-center text-lg leading-tight">{children}</p>
    </div>
  );
}
