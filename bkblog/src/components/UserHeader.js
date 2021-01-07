import React from "react";
import { connect } from "react-redux";
import { fetchUser } from "../actions";

class UserHeader extends React.Component {
  componentDidMount() {
    this.props.fetchUser(this.props.userId);
  }

  render() {
    const user = this.props.users.find(user => user.id === this.props.userId);

    if (!user) {
      return null;
    }

    return <div className="header">{user.name}</div>;
  }
}

// Refactored below function.  So, when the <UserHeader /> function was called in the file PostList.js it was given the prop userId={}
// This prop is passed into the redux-react world and can be called in the map state to props function below.
// This means that mapStateToProps pushes the state from the redux stores into props, and has access to the props that are called on the
// component tag.  This is a cool loop if you can remember it.
const mapStateToProps = (state, ownProps) => {
  return { users: state.users };

  // Removed below code despite it being shown in the video, couldn't get the nested value user.id to not be undefined
  // return { user: state.users.find(user => user.id === ownProps.usersId) };
};

export default connect(
  mapStateToProps,
  { fetchUser }
)(UserHeader);
