const countAverageStars = stars => {
  if (stars.length === 0) {
    return 0;
  } else if (stars.length === 1) {
    return stars[0];
  } else {
    return Math.round(stars.reduce((a, b) => a + b, 0) / stars.length);
  }
};

export { countAverageStars };