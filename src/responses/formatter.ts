import type { StoredValue } from "../models/db.js";



export const formatSimpleString = (text: string): string => {
  return `+${text}\r\n`;
};

export const formatError = (text: string): string => {
  return `-${text}\r\n`;
};

export const formatInteger = (num: number): string => {
  return `:${num}\r\n`;
};

export const formatBulkString = (text: StoredValue | null): string => {
  if (text === null) {
    return `$-1\r\n`;
  }
  return `$${text.value.length}\r\n${text.value}\r\n`;
};

export const formatArray = (items: (StoredValue | null)[]): string => {
  let result = `*${items.length}\r\n`;
  for (const item of items) {
    result += formatBulkString(item);
  }
  return result;
}