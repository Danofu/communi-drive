export default (value: number, x1: number, y1: number, x2: number, y2: number) => {
  const distFromStartPoint = value - x1;
  const slopeRation = (y2 - x2) / (y1 - x1);

  return x2 + distFromStartPoint * slopeRation;
};
