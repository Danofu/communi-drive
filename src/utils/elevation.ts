type Range = [number, number];

const androidElevation = [
  { blur: 1, y: 1 },
  { blur: 2, y: 2 },
  { blur: 4, y: 3 },
  { blur: 5, y: 4 },
  { blur: 8, y: 5 },
  { blur: 10, y: 6 },
  { blur: 10, y: 7 },
  { blur: 10, y: 8 },
  { blur: 12, y: 9 },
  { blur: 14, y: 10 },
  { blur: 15, y: 11 },
  { blur: 17, y: 12 },
  { blur: 19, y: 13 },
  { blur: 21, y: 14 },
  { blur: 22, y: 15 },
  { blur: 24, y: 16 },
  { blur: 26, y: 17 },
  { blur: 28, y: 18 },
  { blur: 29, y: 19 },
  { blur: 31, y: 20 },
  { blur: 33, y: 21 },
  { blur: 35, y: 22 },
  { blur: 36, y: 23 },
  { blur: 38, y: 24 },
];

const elevationLength = androidElevation.length;

const opacityFrom: Range = [androidElevation[0].y, androidElevation[elevationLength - 1].y];
const opacityTo: Range = [0.2, 0.6];

const radiusFrom: Range = [androidElevation[0].blur, androidElevation[elevationLength - 1].blur];
const radiusTo: Range = [1, 16];

const interpolate = (value: number, x1: number, y1: number, x2: number, y2: number) => {
  const distFromStartPoint = value - x1;
  const slopeRation = (y2 - x2) / (y1 - x1);

  return x2 + distFromStartPoint * slopeRation;
};

type Elevation = {
  elevation: number;
  shadowColor: string;
  shadowOffset: { height: number; width: number };
  shadowOpacity: number;
  shadowRadius: number;
};

function elevation(): Elevation;
function elevation(elevation: number): Elevation;
function elevation(elevation = 0): Elevation {
  if (elevation < 0 || elevation > 23) {
    throw new Error(`Elevation values should be between 0 and ${elevationLength}.`);
  }

  const { blur, y } = androidElevation[elevation];

  const height = y === 1 ? 1 : Math.floor(0.5 * y);
  const opacity = +interpolate(elevation, ...opacityFrom, ...opacityTo).toFixed(2);
  const radius = +interpolate(blur, ...radiusFrom, ...radiusTo).toFixed(2);

  return {
    elevation,
    shadowColor: '#000',
    shadowOffset: { height, width: 0 },
    shadowOpacity: opacity,
    shadowRadius: radius,
  };
}

export default elevation;
