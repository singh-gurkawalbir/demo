import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import * as selectors from '../../reducers';
import resourceConstants from '../../forms/constants/connection';
import formFactory from '../../forms/formFactory';
import DynaForm from '../DynaForm';
import consolidatedActions from './Actions';
import { getResourceSubType, multiStepSaveResourceTypes } from '../../utils/resource';
import Spinner from '../Spinner';
import SpinnerWrapper from '../SpinnerWrapper';

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
  const connection = selectors.resource(
    state,
    'connections',
    resource && resource._connectionId
  );
  const { patch: allPatches } = selectors.stagedResource(
    state,
    resourceId,
    'meta'
  );
  const lastPatchtimestamp =
    allPatches &&
    allPatches[allPatches.length - 1] &&
    allPatches[allPatches.length - 1].timestamp;

  return {
    formState,
    resource,
    lastPatchtimestamp,
    connection,
    /* If we return the assistantMetadata as object, it is causing infinite loop when used as a dependency in useEffect */
  };
};

const mapDispatchToProps = dispatch => ({
  handleInitForm: (resourceType, resourceId, isNew, flowId) => {
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

  handleClearResourceForm: (resourceType, resourceId) => {
    dispatch(actions.resourceForm.clear(resourceType, resourceId));
  },
});
const getConnectionType = resource => {
  const { assistant, type } = getResourceSubType(resource);

  if (assistant) return assistant;

  return type;
};

const ActionButtons = ({actions, formProps}) => {
  const [disableSaveOnClick, setDisableSaveOnClick] = useState(false);
  return (actions.length &&
actions.map(action => {
  const Action = consolidatedActions[action.id];
  let actionProps = {};
  if (action.id !== 'cancel') {
    actionProps = {
      disableSaveOnClick,
      setDisableSaveOnClick
    };
  }
  // remove form disabled prop...
  // they dont necessary apply to action button
  const { disabled, ...rest } = formProps;
  return <Action
    key={action.id}
    dataTest={action.id}
    {...rest}
    {...action}
    {...actionProps}
   />;
})) || null;
};

export function ActionsFactory({ variant = 'edit', ...props }) {
  const { resource, resourceType, isNew } = props;
  const { actions } = props.fieldMeta;
  const connectionType = getConnectionType(resource);
  const isMultiStepSaveResource = multiStepSaveResourceTypes.includes(resourceType);
  const actionButtons = useMemo(() => {
    // if props has defined actions return it
    if (actions) return actions;
    let actionButtons;
    // When action button metadata isn't provided we infer the action buttons.
    if (resourceType === 'connections' && !isNew) {
      if (resourceConstants.OAUTH_APPLICATIONS.includes(connectionType)) {
        actionButtons = ['oauth', 'cancel'];
      } else {
        actionButtons = ['testandsave', 'testsaveandclose', 'cancel', 'test'];
      }
    } else if (!isNew || (isNew && !isMultiStepSaveResource)) {
      actionButtons = ['save', 'saveandclose', 'cancel'];
    } else {
      actionButtons = ['saveandclose', 'cancel'];
    }
    return actionButtons.map(id => ({id}));
  }, [actions, connectionType, isNew, resourceType, isMultiStepSaveResource]);
  // console.log('render: <ActionsFactory>');

  if (variant === 'view') {
    return <DynaForm {...props} />;
  }
  return (
    <DynaForm {...props}>
      <ActionButtons actions={actionButtons} formProps={props} />
    </DynaForm>
  );
}

export const FormStateManager = props => {
  const { formState, fieldMeta, onSubmitComplete } = props;
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
  }, [formState.submitComplete]);
  useEffect(() => {
    remountForm();
  }, [fieldMeta, remountForm]);

  if (!formState.initComplete) {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }

  return (
    <ActionsFactory
      onCancel={remountForm}
      {...props}
      {...formState}
      key={count}
    />
  );
};

export const ResourceFormFactory = props => {
  const {
    resourceType,
    formState,
    handleInitForm,
    handleClearResourceForm,
    resource,
    resourceId,
    isNew,
    lastPatchtimestamp,
    flowId,
    connection,
  } = props;

  useEffect(() => {
    handleInitForm(resourceType, resourceId, isNew, flowId);

    return () => handleClearResourceForm(resourceType, resourceId);
  }, [
    flowId,
    handleClearResourceForm,
    handleInitForm,
    isNew,
    lastPatchtimestamp,
    resourceId,
    resourceType,
  ]);

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
      fieldMeta={fieldMeta}
      optionsHandler={optionsHandler}
      validationHandler={validationHandler}
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceFormFactory);
