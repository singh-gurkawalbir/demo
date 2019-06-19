import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import GenericResourceForm from './GenericResourceForm';
import TestableForm from './Connections/TestableForm';
import OAuthForm from './Connections/OAuthForm';
import actions from '../../actions';
import * as selectors from '../../reducers';
import resourceConstants from '../../forms/constants/connection';

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
  handleClearResourceForm: () => {
    dispatch(actions.resourceForm.clear(resourceType, resource._id));
  },
});
const ResourceFormFactory = props => {
  // This useEffect is executed right after any render
  // and the initial mount of the compount
  // you can restrict its execution to be depended on a second
  // prop like the example below, the function you return from
  // this useEffect is executed when the component unmounts
  // Another possible use case is in the second argument you can
  // pass an empty array. This indicates the useEffect is not
  // depended on any prop and is executed when the component
  // mounts and unmounts

  // Note: i have removed the key
  useEffect(() => {
    const { handleInitForm, handleClearResourceForm } = props;

    handleInitForm();

    return handleClearResourceForm;
  }, [props.resource._id]);

  const { resourceType, handleSubmitForm, formState, connectionType } = props;

  if (!formState.initComplete) {
    return <Typography>Initializing Form</Typography>;
  }

  let Form;
  const { fieldMeta, optionsHandler } = formState;
  const commonProps = {
    fieldMeta,
    optionsHandler,
    handleSubmitForm,
  };
  const formProps = commonProps;

  if (resourceType === 'connections') {
    if (resourceConstants.OAUTH_APPLICATIONS.includes(connectionType)) {
      Form = OAuthForm;
    } else {
      Form = TestableForm;
    }
  } else {
    Form = GenericResourceForm;
  }

  return <Form {...props} {...formProps} />;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceFormFactory);
