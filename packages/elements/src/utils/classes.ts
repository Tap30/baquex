import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const classes = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
