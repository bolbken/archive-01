import { combineReducers } from "redux";

import postsReducer from "./postsReducer";
import usersReducer from "./usersReducer";

// REDUCERS must not call outside
export default combineReducers({
  posts: postsReducer,
  users: usersReducer
});
