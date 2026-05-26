export interface EvaporationPoint {
  timeHours: number;
  volatilityPercent: number;
}

export const normalizeChartData = (data: EvaporationPoint[]): EvaporationPoint[] => {
  if (!data || data.length === 0) return [];

  // Group by timeHours (within 0.1 hour tolerance) and average volatilityPercent
  const grouped = new Map<string, EvaporationPoint[]>();

  data.forEach(point => {
    const roundedTime = Math.round(point.timeHours * 10) / 10;
    const key = roundedTime.toString();

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(point);
  });

  // Average duplicate points
  return Array.from(grouped.entries())
    .map(([, points]) => ({
      timeHours: points[0].timeHours,
      volatilityPercent: Math.round(
        points.reduce((sum, p) => sum + p.volatilityPercent, 0) / points.length
      )
    }))
    .sort((a, b) => a.timeHours - b.timeHours);
};
