export type Cons<H, T extends any[]> = ((h: H, ...t: T) => void) extends (
  ...u: infer U
) => void
  ? U
  : never;

export type Stringify<R> = {
  [K in keyof R]: string;
};

export const readFile = (file: File): Promise<string> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target?.result as string);
    reader.onerror = error => reject(error);
    reader.readAsText(file);
  });
};

const parseCsvLine = <T>(headers: string[], line: string): T =>
  (Object.fromEntries(
    line.split(',').map((value, index) => [headers[index], value])
  ) as unknown) as T;

export const parseCsvText = <T>(text: string): T[] => {
  const lines: string[] = text.split('\n');
  const headers: string[] = lines[0].split(',');
  const body: string[] = lines.slice(1);

  return body.map(line => parseCsvLine(headers, line));
};

export const readCsvFile = async <T>(
  file: File,
  transformer: (origin: Stringify<T>) => T
): Promise<T[]> => {
  const csvText = await readFile(file);
  const originalRaws = parseCsvText<Stringify<T>>(csvText);
  const parsedRaws = originalRaws.map(transformer);
  return parsedRaws;
};

// splice也可以达到同样的效果, 但是splice不是纯函数
export const replace = <T extends any[]>(
  arr: T,
  idx: number,
  newElm: T[number]
): T => {
  return [...arr.slice(0, idx), newElm, ...arr.slice(idx + 1)] as T;
};

// 注意是严格比较
export const findDiffIdx = <T>(left: T[], right: T[]): number[] => {
  return left
    .map((leftX, idx) => (leftX === right[idx] ? -1 : idx))
    .filter(idx => idx !== -1);
};

export const range = (start: number, end: number): number[] => {
  const array = [];
  for (let i = start; i < end; i++) {
    array.push(i);
  }
  return array;
};
