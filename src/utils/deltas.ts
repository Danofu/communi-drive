import { Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const ASPECT_RATION = width / height;

type DeltasResult = { latitudeDelta: number; longitudeDelta: number };

export default function deltas(): DeltasResult;
export default function deltas(zoom: number): DeltasResult;
export default function deltas(zoom = 1): DeltasResult {
  const LATITUDE_DELTA = 0.0922 * (1 / zoom);
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATION;
  return { latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA };
}
