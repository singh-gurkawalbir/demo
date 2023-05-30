import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import {Spinner} from '@celigo/fuse-ui';
import actions from '../../actions';
import getResourceFormAssets from '../../forms/formFactory/getResourceFromAssets';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import useFormInitWithPermissions from '../../hooks/useFormInitWithPermissions';
import { selectors } from '../../reducers';
import { FORM_SAVE_STATUS } from '../../constants';
import DynaForm from '../DynaForm';
import { getHttpConnector} from '../../constants/applications';
import {getParentResourceContext} from '../../utils/connections';

const Form = props => {
  const formKey = useFormInitWithPermissions(props);

  return <DynaForm {...props} formKey={formKey} />;
};

export const FormStateManager = ({ formState, handleInitForm, onSubmitComplete, skipInitFormOnSubmit, ...props }) => {
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
      !skipInitFormOnSubmit && handleInitForm && handleInitForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitComplete]);
  useEffect(() => {
    remountForm();
  }, [fieldMeta, remountForm]);

  if (!formState.initComplete) {
    return (
      <Spinner size="large" center="screen" sx={{mt: '60px'}} />
    );
  }

  return <Form {...props} {...formState} key={count} />;
};

const ResourceFormFactory = props => {
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { resourceType, resourceId, isNew, flowId, integrationId } = props;
  const {connId: parentConnectionId} = getParentResourceContext(match.url, resourceType);

  const formState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)
  );
  const resource = useSelectorMemo(
    selectors.makeResourceDataSelector,
    resourceType,
    resourceId
  ).merged;

  const isHttpConnectorParentFormView = useSelector(state => selectors.isHttpConnectorParentFormView(state, resourceId));

  let assistantData;
  const connection = useSelector(state =>
    selectors.resource(state, 'connections', resource && resource._connectionId)
  );
  const connectorMetaData = useSelector(state =>
    selectors.httpConnectorMetaData(state, connection?.http?._httpConnectorId, connection?.http?._httpConnectorVersionId, connection?.http?._httpConnectorApiId)
  );
  const accountOwner = useSelector(() => selectors.accountOwner(), shallowEqual);

  const _httpConnectorId = getHttpConnector(connection?.http?._httpConnectorId)?._id;

  if (_httpConnectorId) {
    assistantData = connectorMetaData;
  }

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
          flowId,
          undefined,
          undefined,
          undefined,
          resourceType === 'iClients' ? parentConnectionId : undefined
        )
      );
    },
    [parentConnectionId, dispatch, flowId, isNew, resourceId, resourceType]
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
          assistantData,
          accountOwner,
          isHttpConnectorParentFormView,
        });
      } catch (e) {
        metadataAssets = {};
      }

      return metadataAssets;
    },
    [resourceType, resource, isNew, connection, integrationId, assistantData, accountOwner, isHttpConnectorParentFormView]
  );
  const { fieldMeta, skipClose } = formState;

  // do not reinitialize the form on submit if it is a multistep save resource..during these transitions skipClose is false
  // operations like saveAndClose should also skip initialization...its only when ur performing just save do you perform initialization
  // during that case does skipClose become false
  const skipInitFormOnSubmit = !skipClose;
  // Incase of shared stack, user has no edit access
  const isSharedStack = resourceType === 'stacks' && resource.shared;

  return (
    <FormStateManager
      {...props}
      formState={formState}
      fieldMeta={fieldMeta}
      handleInitForm={handleInitForm}
      optionsHandler={optionsHandler}
      validationHandler={validationHandler}
      skipInitFormOnSubmit={skipInitFormOnSubmit}
      disabled={isSharedStack}
    />
  );
};

export default ResourceFormFactory;
