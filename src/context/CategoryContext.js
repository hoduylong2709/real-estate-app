import createDataContext from './createDataContext';
import realEstateApi from '../api/realEstate';

const categoryReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_categories':
      return action.payload;
    default:
      return state;
  }
};

const fetchCategories = dispatch => async () => {
  const response = await realEstateApi.get('/categories');
  dispatch({ type: 'fetch_categories', payload: response.data });
};

export const { Provider, Context } = createDataContext(
  categoryReducer,
  { fetchCategories },
  []
);