import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import GenericResourceForm from './GenericResourceForm';
import ConnectionForm from './ConnectionForm';
import actions from '../../actions';
import * as selectors from '../../reducers';

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
  handleTestAndSubmit: values => {
    dispatch(
      actions.resourceForm.testAndSubmit(resourceType, resource._id, values)
    );
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

  const { handleSubmitForm, handleTestAndSubmit, formState, ...rest } = props;

  if (!formState.initComplete) {
    return <Typography>Initializing Form</Typography>;
  }

  let Form;
  const { fieldMeta, optionsHandler } = formState;
  const commonProps = {
    fieldMeta,
    optionsHandler,
    handleSubmit: handleSubmitForm,
  };
  let formProps;

  if (props.resourceType === 'connections') {
    Form = ConnectionForm;
    formProps = { ...commonProps, handleTestAndSubmit };
  } else {
    Form = GenericResourceForm;
    formProps = commonProps;
  }

  return <Form {...rest} {...formProps} />;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceFormFactory);
