export const insertArray = function (arr: any[], index: number, ...items: any) {
  return arr.splice(index, 0, ...items);
};

export function deduplicateArrayByField<T>(arr: T[], field: keyof T) {
  const seen = new Set();
  return arr.reduce((uniqueArray, currentItem) => {
    const itemFieldValue = currentItem[field];
    if (!seen.has(itemFieldValue)) {
      seen.add(itemFieldValue);
      uniqueArray.push(currentItem);
    }
    return uniqueArray;
  }, [] as T[]);
}

export function iterateObject<T, R>(
  obj: Record<string, T>,
  callback: (key: string, item: T, index: number) => R
) {
  return Object.keys(obj).map((key, index) => callback(key, obj[key], index));
}

export function filterObject<T>(obj: Record<string, T>, callback: (item: T) => boolean) {
  return Object.keys(obj).filter(key => callback(obj[key]));
}

export function collectExistentialObject<T>(obj: Record<string, T>) {
  return Object.keys(obj).filter(key => !!obj[key]);
}

export function countExistentialObject<T>(obj: Record<string, T>) {
  return Object.keys(obj).filter(key => !!obj[key]).length;
}

export function cloneArray<T>(arr: T[]) {
  return [...arr];
}

export function maybeEmptyArray<T>(arr: T[] | undefined) {
  return arr || [];
}
