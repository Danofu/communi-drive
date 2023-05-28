export default (value: number, start: number, end: number) => {
  const rangeSize = end - start;
  return start + (rangeSize - (value - start));
};
