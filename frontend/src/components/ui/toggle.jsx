import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cn } from "../../lib/utils"

const Toggle = React.forwardRef(({ className, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
Toggle.displayName = TogglePrimitive.Root.displayName

const ToggleGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("inline-flex", className)}
    {...props}
  />
))
ToggleGroup.displayName = "ToggleGroup"

const ToggleGroupItem = React.forwardRef(({ className, ...props }, ref) => (
  <Toggle
    ref={ref}
    className={cn(
      "data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
ToggleGroupItem.displayName = "ToggleGroupItem"

export { Toggle, ToggleGroup, ToggleGroupItem }