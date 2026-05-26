


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
