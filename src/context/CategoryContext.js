import createDataContext from './createDataContext';
import realEstateApi from '../api/realEstate';

const categoryReducer = (state, action) => {
  switch (action.type) {
    case 'start_fetching':
      return { ...state, categoryLoading: true };
    case 'fetch_categories':
      return { categories: action.payload, categoryLoading: false };
    default:
      return state;
  }
};

const fetchCategories = dispatch => async () => {
  dispatch({ type: 'start_fetching' });
  const response = await realEstateApi.get('/categories');
  dispatch({ type: 'fetch_categories', payload: response.data });
};

export const { Provider, Context } = createDataContext(
  categoryReducer,
  { fetchCategories },
  { categoryLoading: false, categories: [] }
);