import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function OracleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="crispEdges"
      {...props}
      className={cn("text-foreground", props.className)}
    >
      <g className="group">
        {/* Hood */}
        <path d="M3 4H17V5H18V10H17V11H16V12H15V13H14V14H6V13H5V12H4V11H3V10H2V5H3V4Z" className="fill-current" />
        <rect x="4" y="3" width="12" height="1" className="fill-current" />

        {/* Face Shadow */}
        <path d="M5 5H15V6H14V7H13V8H12V9H8V8H7V7H6V6H5V5Z" fill="black" fillOpacity="0.75" />

        {/* Eyes */}
        <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <rect x="8" y="6" width="1" height="1" style={{fill: 'hsl(var(--accent))'}} />
            <rect x="11" y="6" width="1" height="1" style={{fill: 'hsl(var(--accent))'}} />
        </g>
        
        {/* Robe */}
        <path d="M6 14H14V15H13V16H7V15H6V14Z" className="fill-current"/>
      </g>
    </svg>
  );
}
