import { makeStyles } from '@material-ui/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import formFactory from '../../forms/formFactory';
import * as selectors from '../../reducers';
import DynaForm from '../DynaForm';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import Spinner from '../Spinner';

const Form = props => {
  const { fieldMeta } = props;
  const formKey = useFormInitWithPermissions({
    ...props,
    fieldsMeta: fieldMeta,
  });

  return <DynaForm {...props} formKey={formKey} />;
};

const useStyles = makeStyles({
  spinnerWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: 'auto',
  },
});

export const FormStateManager = ({ formState, onSubmitComplete, ...props }) => {
  const { fieldMeta } = props;
  const classes = useStyles();
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
    return (
      <div className={classes.spinnerWrapper}>
        <Spinner />
      </div>
    );
  }

  console.log('rerender FormStateManager');

  return <Form {...props} {...formState} key={count} />;
};

export const ResourceFormFactory = props => {
  const { resourceType, resourceId, isNew, flowId } = props;
  const formState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)
  );
  const resource = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  ).merged;
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
