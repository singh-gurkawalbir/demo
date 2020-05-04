import { Typography } from '@material-ui/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import formFactory from '../../forms/formFactory';
import useResourceData from '../../hooks/selectors/useStaggedResource';
import * as selectors from '../../reducers';
import DynaForm from '../DynaForm';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';

const Form = props => {
  const { fieldMeta } = props;
  const formKey = useFormInitWithPermissions({
    ...props,
    fieldsMeta: fieldMeta,
  });

  return <DynaForm {...props} formKey={formKey} />;
};

export const FormStateManager = ({ formState, onSubmitComplete, ...props }) => {
  const { fieldMeta } = props;
  // once the form successfully completes submission (could be async)
  // we call the parents callback so it can perform some action.

  // TODO: This handler fired every render when i include the
  // onSubmitComplete fn as a dependency... how do i solve this
  // the right way? linter fails if i dont add it...

  // eslint-disable-next-line padding-line-between-statements
  const [count, setCount] = useState(0);
  const remountForm = useCallback(() => setCount(count => count + 1), []);

  useEffect(() => {
    if (formState.submitComplete && onSubmitComplete) {
      onSubmitComplete('', false, formState.formValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.submitComplete /* , onSubmitComplete */]);

  useEffect(() => {
    remountForm();
  }, [fieldMeta, remountForm]);

  if (!formState.initComplete) {
    return <Typography>Initializing Form</Typography>;
  }

  console.log('rerender FormStateManager');

  return <Form {...props} {...formState} key={count} />;
};

export const ResourceFormFactory = props => {
  const { resourceType, resourceId, isNew, flowId } = props;
  const formState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)
  );
  const resource = useResourceData(resourceType, resourceId).merged;
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', resource && resource._connectionId)
  );
  const dispatch = useDispatch();
  const handleInitForm = useCallback(
    (resourceType, resourceId, isNew, flowId) => {
      const skipCommit =
        isNew &&
        [
          'imports',
          'exports',
          'connections',
          'pageGenerator',
          'pageProcessor',
        ].includes(resourceType);

      dispatch(
        actions.resourceForm.init(
          resourceType,
          resourceId,
          isNew,
          skipCommit,
          flowId
        )
      );
    },
    [dispatch]
  );
  const handleClearResourceForm = useCallback(
    (resourceType, resourceId) => {
      dispatch(actions.resourceForm.clear(resourceType, resourceId));
    },
    [dispatch]
  );

  useEffect(() => {
    handleInitForm(resourceType, resourceId, isNew, flowId);

    return () => handleClearResourceForm(resourceType, resourceId);
  }, [
    flowId,
    handleClearResourceForm,
    handleInitForm,
    isNew,
    resourceId,
    resourceType,
  ]);

  console.log('rerender ResourceForm factory');
  const { optionsHandler, validationHandler } = useMemo(
    () =>
      formFactory.getResourceFormAssets({
        resourceType,
        resource,
        isNew,
        connection,
      }),
    [connection, isNew, resource, resourceType]
  );
  const { fieldMeta } = formState;

  return (
    <FormStateManager
      {...props}
      resource={resource}
      formState={formState}
      fieldMeta={fieldMeta}
      optionsHandler={optionsHandler}
      validationHandler={validationHandler}
    />
  );
};

export default ResourceFormFactory;
