import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function CaveEntranceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M100,0 C40,0 0,40 0,100V200 H200 V100 C200,40 160,0 100,0 Z M100,20 C150,20 180,50 180,100V180 H20 V100 C20,50 50,20 100,20 Z"
        fillRule="evenodd"
        className={cn("fill-current", props.className)}
      />
    </svg>
  );
}
