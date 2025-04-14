/** @format */

import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
//예시
//<div className={`btn ${isActive ? 'btn-primary' : ''}`} />

// <div className={cn('btn', isActive && 'btn-primary')} />
