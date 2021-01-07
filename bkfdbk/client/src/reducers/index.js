import { combineReducers } from "redux";
import { reducer as reduxForm } from "redux-form";
import authReducer from "./authReducer";

export default combineReducers({
  // left= the name of the state object, right= the reducer that edits to the state object
  auth: authReducer,
  form: reduxForm
});
