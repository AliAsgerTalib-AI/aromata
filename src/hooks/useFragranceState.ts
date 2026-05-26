import { useState } from 'react';
import { FragranceData } from '../types';
import { PREDEFINED_FRAGRANCES } from '../data';
import { fragranceExistsInCabinet } from '../fragranceUtils';

export function useFragranceState() {
  const [selectedFragrance, setSelectedFragrance] = useState<FragranceData>(PREDEFINED_FRAGRANCES[0]);
  const [cabinet, setCabinet] = useState<FragranceData[]>([]);
  const [comparedSpecimens, setComparedSpecimens] = useState<string[]>([]);

  const updateCabinet = (newCabinet: FragranceData[]) => {
    setCabinet(newCabinet);
  };

  const handleAddToCabinet = (fragrance: FragranceData) => {
    if (!fragranceExistsInCabinet(fragrance, cabinet)) {
      updateCabinet([fragrance, ...cabinet]);
    }
  };

  const handleRemoveFromCabinet = (brand: string, name: string) => {
    const filtered = cabinet.filter(f => !(f.brand === brand && f.name === name));
    updateCabinet(filtered);

    if (selectedFragrance.brand === brand && selectedFragrance.name === name) {
      if (filtered.length > 0) {
        setSelectedFragrance(filtered[0]);
      } else if (PREDEFINED_FRAGRANCES.length > 0) {
        setSelectedFragrance(PREDEFINED_FRAGRANCES[0]);
      }
    }
  };

  const handleToggleCompare = (brand: string, name: string) => {
    const compID = `${brand} - ${name}`;
    if (comparedSpecimens.includes(compID)) {
      setComparedSpecimens(comparedSpecimens.filter(id => id !== compID));
    } else {
      if (comparedSpecimens.length >= 2) {
        return false;
      }
      setComparedSpecimens([...comparedSpecimens, compID]);
    }
    return true;
  };

  return {
    selectedFragrance,
    setSelectedFragrance,
    cabinet,
    updateCabinet,
    comparedSpecimens,
    setComparedSpecimens,
    handleAddToCabinet,
    handleRemoveFromCabinet,
    handleToggleCompare,
  };
}
