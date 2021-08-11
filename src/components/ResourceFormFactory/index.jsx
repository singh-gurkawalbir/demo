import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../actions';
import getResourceFormAssets from '../../forms/formFactory/getResourceFromAssets';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';
import { selectors } from '../../reducers';
import { FORM_SAVE_STATUS } from '../../utils/constants';
import DynaForm from '../DynaForm';
import Spinner from '../Spinner';

const Form = props => {
  const formKey = useFormInitWithPermissions(props);

  return <DynaForm {...props} formKey={formKey} />;
};

export const FormStateManager = ({ formState, handleInitForm, onSubmitComplete, ...props }) => {
  const { fieldMeta } = props;
  // once the form successfully completes submission (could be async)
  // we call the parents callback so it can perform some action.

  // TODO: This handler fired every render when i include the
  // onSubmitComplete fn as a dependency... how do i solve this
  // the right way? linter fails if i dont add it...

  // eslint-disable-next-line padding-line-between-statements
  const [count, setCount] = useState(0);
  const remountForm = useCallback(() => setCount(count => count + 1), []);

  const isSubmitComplete = formState?.formSaveStatus === FORM_SAVE_STATUS.COMPLETE;

  useEffect(() => {
    if (isSubmitComplete) {
      onSubmitComplete && onSubmitComplete('', false, formState.formValues);
      // when submit is complete reinitialize the resourceForm
      // this applies to Regular resource forms and suiteScript forms
      handleInitForm && handleInitForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitComplete]);
  useEffect(() => {
    remountForm();
  }, [fieldMeta, remountForm]);

  if (!formState.initComplete) {
    return (
      <Spinner centerAll />
    );
  }

  return <Form {...props} {...formState} key={count} />;
};

export const ResourceFormFactory = props => {
  const { resourceType, resourceId, isNew, flowId, integrationId } = props;
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
    () => {
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
    [dispatch, flowId, isNew, resourceId, resourceType]
  );
  const handleClearResourceForm = useCallback(
    () => {
      dispatch(actions.resourceForm.clear(resourceType, resourceId));
    },
    [dispatch, resourceId, resourceType]
  );

  useEffect(() => {
    handleInitForm();

    return () => handleClearResourceForm();
  }, [handleClearResourceForm, handleInitForm]);

  const { optionsHandler, validationHandler } = useMemo(
    () => {
      let metadataAssets;

      try {
        // try to load the assets if it can't initForm saga should fail anyway
        metadataAssets = getResourceFormAssets({
          resourceType,
          resource,
          isNew,
          connection,
          integrationId,
        });
      } catch (e) {
        metadataAssets = {};
      }

      return metadataAssets;
    },
    [connection, isNew, resource, resourceType, integrationId]
  );
  const { fieldMeta } = formState;

  return (
    <FormStateManager
      {...props}
      formState={formState}
      fieldMeta={fieldMeta}
      handleInitForm={handleInitForm}
      optionsHandler={optionsHandler}
      validationHandler={validationHandler}
    />
  );
};

export default ResourceFormFactory;
