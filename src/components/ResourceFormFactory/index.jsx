import { useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import actions from '../../actions';
import * as selectors from '../../reducers';
import resourceConstants from '../../forms/constants/connection';
import formFactory from '../../forms/formFactory';
import DynaForm from '../DynaForm';
import consolidatedActions from './Actions';

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
  };
};

const mapDispatchToProps = dispatch => ({
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

function ActionsFactory(props) {
  const { resourceType, isNew, connectionType } = props;
  const { actions } = props.fieldMeta;

  // When action buttons is provided in the metadata then we generate the action buttons for you
  if (actions) {
    const ActionButtons = actions.map(action => {
      const Action = consolidatedActions[action.id];

      return <Action key={action.id} {...props} {...action} />;
    });

    return <DynaForm {...props}>{ActionButtons}</DynaForm>;
  }

  let actionButtons;

  // When action button metadata isn't provided we infer the action buttons.
  if (resourceType === 'connections' && !isNew) {
    if (resourceConstants.OAUTH_APPLICATIONS.includes(connectionType)) {
      actionButtons = ['cancel', 'oauth'];
    } else {
      actionButtons = ['test', 'cancel', 'testandsave'];
    }
  } else {
    actionButtons = ['cancel', 'save'];
  }

  const actionButtonsCreator = actions =>
    actions.map(id => {
      const Action = consolidatedActions[id];

      return <Action key={id} {...props} />;
    });

  return <DynaForm {...props}>{actionButtonsCreator(actionButtons)}</DynaForm>;
}

export const ResourceFormFactory = props => {
  const {
    resourceType,
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

  // TODO: This handler fired every render when i include the
  // onSubmitComplete fn as a dependency... how do i solve this
  // the right way? linter fails if i dont add it...
  useEffect(() => {
    if (formState.submitComplete && onSubmitComplete) {
      // console.log('fired onSubmitComplete');
      onSubmitComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.submitComplete /* , onSubmitComplete */]);

  const { optionsHandler } = useMemo(
    () => formFactory.getResourceFormAssets({ resourceType, resource, isNew }),
    [isNew, resource, resourceType]
  );
  const { fieldMeta } = formState;

  useEffect(() => {
    setCount(count => count + 1);
  }, [fieldMeta]);

  if (!formState.initComplete) {
    return <Typography>Initializing Form</Typography>;
  }

  return (
    <ActionsFactory
      {...props}
      {...formState}
      connectionType={connectionType}
      optionsHandler={optionsHandler}
      onCancel={() => setCount(count => count + 1)}
      key={count}
    />
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResourceFormFactory);
