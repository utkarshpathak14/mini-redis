


export const formatSimpleString = (text: string): string => {
  return `+${text}\r\n`;
};

export const formatError = (text: string): string => {
  return `-${text}\r\n`;
};

export const formatInteger = (num: number): string => {
  return `:${num}\r\n`;
};

export const formatBulkString = (text: string | null): string => {
  if (text === null) {
    return `$-1\r\n`;
  }
  return `$${text.length}\r\n${text}\r\n`;
};

export const formatArray = (items: (string | null)[]): string => {
  let result = `*${items.length}\r\n`;
  for (const item of items) {
    result += formatBulkString(item);
  }
  return result;
}