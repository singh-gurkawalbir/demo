import { useEffect, useMemo, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import actions from '../../actions';
import * as selectors from '../../reducers';
import resourceConstants from '../../forms/constants/connection';
import formFactory from '../../forms/formFactory';
import DynaForm from '../DynaForm';
import consolidatedActions from './Actions';
import { getResourceSubType } from '../../utils/resource';

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

export function ActionsFactory(props) {
  const { resource, resourceType, isNew, variant = 'edit' } = props;
  const { actions } = props.fieldMeta;
  const connectionType = getConnectionType(resource);

  // console.log('render: <ActionsFactory>');

  if (variant === 'view') {
    return <DynaForm {...props} />;
  }

  // When action buttons is provided in the metadata then we generate the action buttons for you
  if (actions) {
    const ActionButtons =
      actions.length > 0 &&
      actions.map(action => {
        const Action = consolidatedActions[action.id];

        return <Action key={action.id} {...props} {...action} />;
      });

    return <DynaForm {...props}>{ActionButtons}</DynaForm>;
  }

  let actionButtons;

  // When action button metadata isn't provided we infer the action buttons.
  if (resourceType === 'connections' && !isNew) {
    if (resourceConstants.OAUTH_APPLICATIONS.includes(connectionType)) {
      actionButtons = ['oauth', 'cancel'];
    } else {
      actionButtons = ['test', 'cancel', 'testandsave'];
    }
  } else {
    actionButtons = ['save', 'cancel'];
  }

  return (
    <DynaForm {...props}>
      {actionButtons.map(key => {
        const Action = consolidatedActions[key];

        return <Action key={key} dataTest={key} {...props} />;
      })}
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
      // console.log('fired onSubmitComplete');
      onSubmitComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.submitComplete /* , onSubmitComplete */]);

  useEffect(() => {
    remountForm();
  }, [fieldMeta, remountForm]);

  if (!formState.initComplete) {
    return <Typography>Initializing Form</Typography>;
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

  const optionsHandler = useMemo(
    () =>
      formFactory.getResourceFormAssets({
        resourceType,
        resource,
        isNew,
        connection,
      }).optionsHandler,
    [connection, isNew, resource, resourceType]
  );
  const { fieldMeta } = formState;

  return (
    <FormStateManager
      {...props}
      fieldMeta={fieldMeta}
      optionsHandler={optionsHandler}
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceFormFactory);
