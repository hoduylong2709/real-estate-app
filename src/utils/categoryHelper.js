const getCategoryByName = (categoryName, categories) => {
  return categories.find(category => category.name === categoryName);
};

const getCategoryFilters = category => {
  let filters = [];
  for (const filter in category) {
    if (category[filter] === true) {
      filters.push(filter);
    }
  }

  return filters;
};

export { getCategoryByName, getCategoryFilters };