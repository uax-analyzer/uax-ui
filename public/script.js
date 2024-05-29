// https://stackoverflow.com/questions/5294955/how-to-scale-down-a-range-of-numbers-with-a-known-min-and-max-value
function scale(unscaledNum, minAllowed, maxAllowed, min, max) {
  return (maxAllowed - minAllowed) * (unscaledNum - min) / (max - min) + minAllowed;
}

function scaleToLikert(num){
  return scale(num, 1, 5, 0.0, 1.0);
}

const colorScale = chroma.scale(['#FF3131', '#008000']).mode('hsl').colors(5);
const levelScale = ['very low usability', 'low usability', 'moderate usability', 'high usability', 'very high usability'];

function scoreRange(score) {
  switch (true) {
    case score < 1.81:
      return 0;
    case score < 2.62:
      return 1;
    case score < 3.43:
      return 2;
    case score < 4.24:
      return 3;
    default:
      return 4;
  }
}