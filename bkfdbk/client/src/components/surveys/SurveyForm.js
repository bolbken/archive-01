import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { reduxForm, Field } from "redux-form";

import SurveyField from "./SurveyField";
import validateEmails from "../../utils/validateEmails";

const FIELDS = [
  { label: "Survey Title", name: "title" },
  { label: "Email Subject", name: "subject" },
  { label: "Email Body", name: "body" },
  { label: "Recipient List", name: "emails" }
];

class SurveyForm extends Component {
  renderFields() {
    return _.map(FIELDS, field => {
      return (
        <Field
          component={SurveyField}
          type="text"
          label={field.label}
          name={field.name}
          key={field.name}
        />
      );
    });
  }

  render() {
    // console.log(this.props);

    return (
      <div className="container">
        <form onSubmit={this.props.handleSubmit(value => console.log(value))}>
          {this.renderFields()}
          <Link to="/surveys" className="red btn-flat left white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  errors.emails = validateEmails(values.emails || "");

  _.each(FIELDS, ({ name, label }) => {
    if (!values[name]) {
      errors[name] = `You must provide a ${label}.`;
    }
  });

  return errors;
}

export default reduxForm({
  validate: validate,
  form: "surveyForm"
})(SurveyForm);
