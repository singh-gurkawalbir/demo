import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import GenericResourceForm from './GenericResourceForm';
import TestableForm from './Connections/TestableForm';
import OAuthForm from './Connections/OAuthForm';
import actions from '../../actions';
import * as selectors from '../../reducers';
import resourceConstants from '../../forms/constants/connection';
import formFactory from '../../forms/formFactory';

const mapStateToProps = (state, { resourceType, resourceId }) => {
  const formState = selectors.resourceFormState(
    state,
    resourceType,
    resourceId
  );
  const { merged: resource } = selectors.resourceData(
    state,
    resourceType,
    resourceId
  );
  const { patch: allPatches } = selectors.resourceData(
    state,
    resourceType,
    resourceId,
    'meta'
  );
  const lastPatchtimestamp = allPatches && allPatches[allPatches.length - 1];

  return {
    formState,
    resource,
    lastPatchtimestamp,
  };
};

const mapDispatchToProps = dispatch => ({
  handleSubmitForm: (resourceType, resourceId) => values => {
    dispatch(actions.resourceForm.submit(resourceType, resourceId, values));
  },

  handleInitForm: (resourceType, resourceId, isNew) => {
    const skipCommit =
      isNew && ['imports', 'exports', 'connections'].includes(resourceType);

    dispatch(
      actions.resourceForm.init(resourceType, resourceId, isNew, skipCommit)
    );
  },

  handleClearResourceForm: (resourceType, resourceId) => {
    dispatch(actions.resourceForm.clear(resourceType, resourceId));
  },
});

export const ResourceFormFactory = props => {
  const {
    resourceType,
    handleSubmitForm: submitForm,
    formState,
    connectionType,
    handleInitForm,
    handleClearResourceForm,
    onSubmitComplete,
    resource,
    resourceId,
    isNew,
    lastPatchtimestamp,
  } = props;
  const [count, setCount] = useState(0);
  const handleSubmitForm = submitForm(resourceType, resourceId);

  useEffect(() => {
    handleInitForm(resourceType, resourceId, isNew);

    return () => handleClearResourceForm(resourceType, resourceId);
  }, [
    handleClearResourceForm,
    handleInitForm,
    isNew,
    lastPatchtimestamp,
    resourceId,
    resourceType,
  ]);

  // once the form successfully completes submission (could be async)
  // we call the parents callback so it can perform some action.
  useEffect(() => {
    if (formState.submitComplete && onSubmitComplete) {
      onSubmitComplete();
    }
  }, [formState.submitComplete, onSubmitComplete]);

  // Pass in isNew
  const { optionsHandler } = useMemo(
    () => formFactory.getResourceFormAssets({ resourceType, resource }),
    [resource, resourceType]
  );
  const { fieldMeta, isNew: isNewForm } = formState;

  useEffect(() => {
    setCount(count => count + 1);
  }, [fieldMeta]);

  if (!formState.initComplete) {
    return <Typography>Initializing Form</Typography>;
  }

  let Form;
  const commonProps = {
    fieldMeta,
    optionsHandler,
    handleSubmitForm,
  };
  const formProps = commonProps;

  if (resourceType === 'connections' && !isNewForm) {
    if (resourceConstants.OAUTH_APPLICATIONS.includes(connectionType)) {
      Form = OAuthForm;
    } else {
      Form = TestableForm;
    }
  } else {
    Form = GenericResourceForm;
  }

  return <Form key={count} {...props} {...formProps} />;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceFormFactory);
