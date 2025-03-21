export const formatNumberUSD = (num: number) => {
  return num.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export function formatNumberCompact(num: number, digits: number) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
  const items = lookup.filter(item => num >= item.value);
  const item = items[items.length - 1];
  return `${
    item ? (num / item.value).toFixed(digits).replace(regexp, '').concat(item.symbol) : '0'
  }`;
}
