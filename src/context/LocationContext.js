import createDataContext from './createDataContext';

const locationReducer = (state, action) => {
  switch (action.type) {
    case 'add_location':
      return { location: action.payload };
    default:
      return state;
  }
};

const addLocation = dispatch => location => {
  dispatch({ type: 'add_location', payload: location });
};

export const { Context, Provider } = createDataContext(
  locationReducer,
  { addLocation },
  { location: null }
);