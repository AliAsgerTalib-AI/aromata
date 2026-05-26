import { FragranceData } from '../types';

export const getInterpolatedSillageRadius = (fragrance: FragranceData, hour: number): number => {
  const curve = fragrance.sillageProjectionRadiusCurve;
  if (!curve || curve.length === 0) return 3.0;

  const exact = curve.find(c => c.hour === hour);
  if (exact !== undefined) return exact.radiusFeet;

  if (hour <= curve[0].hour) return curve[0].radiusFeet;
  if (hour >= curve[curve.length - 1].hour) return curve[curve.length - 1].radiusFeet;

  let lowIdx = 0;
  for (let i = 0; i < curve.length; i++) {
    if (curve[i].hour <= hour) {
      lowIdx = i;
    } else {
      break;
    }
  }

  const highIdx = lowIdx + 1;
  const pLow = curve[lowIdx];
  const pHigh = curve[highIdx];
  const fraction = (hour - pLow.hour) / (pHigh.hour - pLow.hour);

  return pLow.radiusFeet + (pHigh.radiusFeet - pLow.radiusFeet) * fraction;
};
