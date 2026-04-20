export const getHeatColor = (ratio: number, isTurnover: boolean = false) => {
  let adjustedRatio = isTurnover ? 1 - ratio : ratio;

  // Increase contrast by pushing values towards the extremes
  adjustedRatio = adjustedRatio > 0.5 
    ? Math.pow(adjustedRatio, 2) 
    : 1 - Math.pow(1 - adjustedRatio, 2);

  const r = Math.round(255 * adjustedRatio);
  const b = Math.round(255 * (1 - adjustedRatio));
  const g = Math.round(50 * (1 - Math.abs(adjustedRatio - 0.5) * 2));
  
  const opacity = 0.1 + (Math.abs(adjustedRatio - 0.5) * 0.8);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity.toFixed(2)})`;
};

export const getTextColor = (backgroundColor: string) => {
  if (backgroundColor === "transparent") return "inherit";
  const rgba = backgroundColor.match(/\d+(\.\d+)?/g);
  if (!rgba || rgba.length < 4) return "inherit";
  
  const [r, g, b, a] = rgba.map(Number);
  if (a < 0.4) return "inherit";
  
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#ffffff";
};
