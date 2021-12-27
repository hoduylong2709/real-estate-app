import createDataContext from './createDataContext';
import realEstateApi from '../api/realEstate';

const conversationReducer = (state, action) => {
  switch (action.type) {
    case 'fetch_conversations':
      return action.payload;
    default:
      return state;
  }
};

const fetchConversations = dispatch => async userId => {
  const response = await realEstateApi.get(`/conversations/${userId}`);
  dispatch({ type: 'fetch_conversations', payload: response.data });
};

export const { Provider, Context } = createDataContext(
  conversationReducer,
  { fetchConversations },
  []
);