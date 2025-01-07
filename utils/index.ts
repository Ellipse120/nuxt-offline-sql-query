import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Updater } from "@tanstack/vue-table";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value =
    typeof updaterOrValue === "function"
      ? updaterOrValue(ref.value)
      : updaterOrValue
}

export { cn, valueUpdater };
