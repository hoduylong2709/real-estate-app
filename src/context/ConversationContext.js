import createDataContext from './createDataContext';
import realEstateApi from '../api/realEstate';

const conversationReducer = (state, action) => {
  switch (action.type) {
    case 'process_start':
      return { ...state, loading: true };
    case 'fetch_conversations':
      return { ...state, conversations: action.payload };
    case 'delete_conversation':
      return {
        ...state,
        errorMessage: '',
        loading: false,
        conversations: state.conversations.filter(conversation => conversation._id !== action.payload)
      };
    case 'add_error':
      return { ...state, errorMessage: action.payload, loading: false };
    default:
      return state;
  }
};

const fetchConversations = dispatch => async userId => {
  const response = await realEstateApi.get(`/conversations/${userId}`);
  dispatch({ type: 'fetch_conversations', payload: response.data });
};

const deleteConversation = dispatch => async convId => {
  dispatch({ type: 'process_start' });
  try {
    const response = await realEstateApi.delete(`/conversations/${convId}`);
    dispatch({ type: 'delete_conversation', payload: response.data._id });
  } catch (error) {
    dispatch({ type: 'add_error', payload: 'Cannot delete conversation. Please try again!' });
  }
};

export const { Provider, Context } = createDataContext(
  conversationReducer,
  { fetchConversations, deleteConversation },
  { conversations: [], loading: false, errorMessage: '' }
);