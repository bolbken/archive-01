import React from "react";
import ReactDOM from "react-dom";
import SeasonDisplay from "./SeasonDisplay";
import LoadingDisplay from "./LoadingDisplay";
import useLocation from "./useLocation";

const App = () => {
  const [lat, errorMessage] = useLocation();

  let content;
  if (errorMessage) {
    content = <div>Error: {errorMessage}</div>;
  } else if (lat) {
    content = <SeasonDisplay lat={lat} />;
  } else {
    content = <LoadingDisplay message="Please accept location request" />;
  }

  return <div className="border red">{content}</div>;
};

// class App extends React.Component {
//   state = { lat: null, errorMessage: "" };

//   componentDidMount() {
//     window.navigator.geolocation.getCurrentPosition(
//       position => {
//         // We called setState to update our app when we know the latitude value.
//         // We DID NOT directly assign this.state.lat... its bad practice.
//         this.setState({ lat: position.coords.latitude });
//       },
//       err => {
//         this.setState({ errorMessage: err.message });
//       }
//     );
//   }

//   //Helper render function
//   renderContent() {
//     if (this.state.errorMessage && !this.state.lat) {
//       return <div>Error: {this.state.errorMessage}</div>;
//     }

//     if (!this.state.errorMessage && this.state.lat) {
//       return <SeasonDisplay lat={this.state.lat} />;
//     }

//     return <LoadingDisplay />;
//   }

//   // React requires we call render() method
//   // Try an keep only the global formatting of the page in this function and call all other content seperately within.
//   render() {
//     return <div className="border red">{this.renderContent()}</div>;
//   }
// }

ReactDOM.render(<App />, document.querySelector("#root"));

// Old constructor before refactor

// constructor(props) {
//     // super must be called so the "React.Component" parent constructor gets called.
//     super(props);

//     // This is the only place where we do direct assignment to the state object
//     this.state = {
//         lat: null,
//         errorMessage: ''
//     };

//
