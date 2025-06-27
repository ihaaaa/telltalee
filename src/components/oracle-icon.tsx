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
        <rect x="5" y="2" width="10" height="1" className="fill-current" />
        <rect x="4" y="3" width="12" height="1" className="fill-current" />
        <rect x="3" y="4" width="14" height="1" className="fill-current" />
        <rect x="3" y="5" width="2" height="5" className="fill-current" />
        <rect x="15" y="5" width="2" height="5" className="fill-current" />
        <rect x="5" y="5" width="1" height="1" className="fill-current" />
        <rect x="14" y="5" width="1" height="1" className="fill-current" />

        {/* Face shadow */}
        <rect x="5" y="5" width="10" height="5" fill="hsl(var(--background))" />

        {/* Subtle animation: eyes appearing on hover/focus */}
        <rect
          x="8"
          y="6"
          width="1"
          height="1"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{fill: 'hsl(var(--accent))'}}
        />
        <rect
          x="11"
          y="6"
          width="1"
          height="1"
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{fill: 'hsl(var(--accent))'}}
        />

        {/* Body */}
        <rect x="4" y="10" width="12" height="1" className="fill-current" />
        <rect x="5" y="11" width="10" height="1" className="fill-current" />
        <rect x="6" y="12" width="8" height="1" className="fill-current" />
        <rect x="7" y="13" width="6" height="1" className="fill-current" />
      </g>
    </svg>
  );
}
