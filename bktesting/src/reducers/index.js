import { combineReducers } from "redux";

import commentsReducer from "./comments";
import authReducer from "../reducers/auth";

export default combineReducers({
  comments: commentsReducer,
  auth: authReducer
});
