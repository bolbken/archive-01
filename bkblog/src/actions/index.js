import _ from "lodash";
import jsonPlaceholder from "../apis/jsonPlaceholder";

export const fetchPostsAndUsers = () => async (dispatch, getState) => {
  await dispatch(fetchPosts());
  console.log(getState().posts);
};

export const fetchPosts = () => {
  // When dealing with async fetching in action creators, use middleware and return functions
  // for the middleware instead of plain js objects for the redux store

  // Since we are using middleware we can return a function with an action creator,
  // Action creator middleware takes two params dispatch (sends to all reducers) and getState which
  // Pulls off the most recent state the redux store
  return async (dispatch, getState) => {
    // This is the function we are having to wait for a response
    const response = await jsonPlaceholder.get("/posts");

    // Once we get a response we send the value to the dispath() fn as a plain js obj so it
    // can be sent to all the reducers.
    dispatch({ type: "FETCH_POSTS", payload: response });
  };
};

export const fetchUser = id => dispatch => _fetchUser(id, dispatch);

const _fetchUser = _.memoize(async (id, dispatch, getState) => {
  const response = await jsonPlaceholder.get(`/users/${id}`);

  dispatch({ type: "FETCH_USER", payload: response.data });
});
