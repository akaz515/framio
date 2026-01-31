
export interface FrameSettings {
  zoom: number;
  offsetX: number;
  offsetY: number;
}

export const TEMPLATE_CONFIG = {
  // Proporcje okienka wyliczone z przesłanej grafiki #AbsolwentPWr
  // Okienko zaczyna się pod bordowym pasem i kończy nad panoramą miasta
  holeX: 0.130,      // 13.0% od lewej
  holeY: 0.235,      // 23.5% od góry
  holeWidth: 0.740,  // 74.0% szerokości
  holeHeight: 0.575, // 57.5% wysokości
  aspectRatio: 1200 / 848
};
