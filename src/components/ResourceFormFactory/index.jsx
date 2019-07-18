import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import GenericResourceForm from './GenericResourceForm';
import TestableForm from './Connections/TestableForm';
import OAuthForm from './Connections/OAuthForm';
import actions from '../../actions';
import * as selectors from '../../reducers';
import resourceConstants from '../../forms/constants/connection';

const mapStateToProps = (state, { resourceType, resourceId }) => {
  const formState = selectors.resourceFormState(
    state,
    resourceType,
    resourceId
  );

  return {
    formState,
  };
};

const mapDispatchToProps = (dispatch, { resourceType, resourceId, isNew }) => ({
  handleSubmitForm: values => {
    // console.log(`request resource:`, resourceType, resourceId);
    dispatch(actions.resourceForm.submit(resourceType, resourceId, values));
  },

  handleInitForm: () => {
    dispatch(actions.resourceForm.init(resourceType, resourceId, isNew));
  },

  handleClearResourceForm: () => {
    dispatch(actions.resourceForm.clear(resourceType, resourceId));
  },
});

export const ResourceFormFactory = props => {
  const {
    resourceType,
    handleSubmitForm,
    formState,
    connectionType,
    handleInitForm,
    handleClearResourceForm,
    onSubmitComplete,
  } = props;
  const [componentRemount, setComponentRemount] = useState(true);

  // This useEffect is executed right after any render
  // and the initial mount of the component
  // you can restrict its execution to be depended on a second
  // prop like the example below, the function you return from
  // this useEffect is executed when the component remounts
  // Another possible use case is in the second argument you can
  // pass an empty array. This indicates the useEffect is not
  // depended on any prop and is executed when the component
  // mounts and remounts
  useEffect(() => {
    if (componentRemount) setComponentRemount(false);

    handleInitForm();

    return handleClearResourceForm;
    // TODO: Surya
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.resourceId]);

  // once the form successfully completes submission (could be async)
  // we call the parents callback so it can perform some action.
  useEffect(() => {
    if (formState.submitComplete && onSubmitComplete) {
      onSubmitComplete();
    }
  }, [formState.submitComplete, onSubmitComplete]);

  if (!formState.initComplete || componentRemount) {
    return <Typography>Initializing Form</Typography>;
  }

  let Form;
  const { fieldMeta, optionsHandler, isNew } = formState;
  const commonProps = {
    handleInitForm,
    fieldMeta,
    optionsHandler,
    handleSubmitForm,
  };
  const formProps = commonProps;

  if (resourceType === 'connections' && !isNew) {
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
