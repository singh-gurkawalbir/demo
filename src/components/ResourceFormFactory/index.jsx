import { Component } from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import GenericResourceForm from './GenericResourceForm';
import TestableForm from './Connections/TestableForm';
import OAuthForm from './Connections/OAuthForm';
import actions from '../../actions';
import * as selectors from '../../reducers';
import resourceConstants from '../../forms/constants';

const mapStateToProps = (state, { resourceType, resource }) => {
  const formState = selectors.resourceFormState(
    state,
    resourceType,
    resource._id
  );

  return {
    formState,
  };
};

const mapDispatchToProps = (dispatch, { resourceType, resource }) => ({
  handleSubmitForm: values => {
    // console.log(`request resource:`, resourceType, resource._id, connection);
    dispatch(actions.resourceForm.submit(resourceType, resource._id, values));
  },
  handleInitForm: () => {
    dispatch(actions.resourceForm.init(resourceType, resource._id));
  },
});

class ResourceFormFactory extends Component {
  state = {
    intializing: true,
  };
  componentDidMount() {
    this.setState({ intializing: true });
    this.props.handleInitForm();
  }
  componentDidUpdate() {
    const { formState } = this.props;
    const { intializing } = this.state;

    if (intializing && formState && formState.initComplete) {
      // documentation indicates componentDidUpdate a safe place
      // to call setState
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ intializing: false });
    }
  }

  render() {
    const { resourceType, handleSubmitForm, formState, resource } = this.props;
    const { intializing } = this.state;

    if (intializing) {
      return <Typography>Initializing Form</Typography>;
    }

    let Form;

    if (resourceType === 'connections') {
      const connectionType = (resource && resource.assistant) || resource.type;

      if (resourceConstants.OAUTH_APPLICATIONS.includes(connectionType)) {
        Form = OAuthForm;
      } else {
        Form = TestableForm;
      }
    } else {
      Form = GenericResourceForm;
    }

    return (
      <Form
        {...this.props}
        fieldMeta={formState.fieldMeta}
        optionsHandler={formState.optionsHandler}
        handleSubmit={handleSubmitForm}
      />
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceFormFactory);
