import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import formFactory from '../../../forms/formFactory';
import DynaForm from '../../DynaForm';
import consolidatedActions from './Actions';

const mapStateToProps = (
  state,
  { resourceType, resourceId, ssLinkedConnectionId }
) => {
  const formState = selectors.suiteScriptResourceFormState(state, {
    resourceType,
    resourceId,
    ssLinkedConnectionId,
  });
  const { merged: resource } = selectors.suiteScriptResourceData(state, {
    resourceType,
    id: resourceId,
    ssLinkedConnectionId,
  });
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
  };
};

const mapDispatchToProps = dispatch => ({
  handleInitForm: (
    ssLinkedConnectionId,
    resourceType,
    resourceId,
    flowId,
  ) => {
    dispatch(
      actions.suiteScript.resourceForm.init(
        ssLinkedConnectionId,
        resourceType,
        resourceId,
        false,
        false,
        flowId,
        undefined,
      )
    );
  },

  handleClearResourceForm: (ssLinkedConnectionId, resourceType, resourceId) => {
    dispatch(
      actions.suiteScript.resourceForm.clear(
        ssLinkedConnectionId,
        resourceType,
        resourceId,
      )
    );
  },
});

/**
 * We use primary and secondary actions to differentiate two sets of buttons we use for forms
 * primary - save, save&close, cancel
 * secondary - test, validate, ...other sort of actions
 * TODO @Surya: Revisit this once form refactor is done
 */
const ActionButtons = ({actions, formProps, proceedOnChange}) => {
  const [disableSaveOnClick, setDisableSaveOnClick] = useState(false);
  const primaryActions = [];
  const secondaryActions = [];

  if (actions.length) {
    actions.forEach(action => {
      const Action = consolidatedActions[action.id];
      let actionProps = {};

      /**
      * Passes a global state for disable functionality for actions except 'cancel'
      * used to manage disable states across buttons
      * Ex: when save is clicked , save&close gets disabled
      * In these cases, individual actions are recommended to use this disable prop to update
      * rather than a local state
      */
      if (action.id !== 'cancel') {
        actionProps = {
          disableSaveOnClick,
          setDisableSaveOnClick,
        };
      }
      // remove form disabled prop...
      // they dont necessary apply to action button
      const { disabled, ...rest } = formProps;
      const actionContainer = (
        <Action
          key={action.id}
          dataTest={action.id}
          proceedOnChange={proceedOnChange}
          {...rest}
          {...action}
          {...actionProps}
      />
      );

      if (action.mode === 'secondary') {
        secondaryActions.push(actionContainer);
      } else {
        primaryActions.push(actionContainer);
      }
    });
  } else {
    return null;
  }

  return (
    <>
      <div> {primaryActions} </div>
      <div> { secondaryActions }</div>
    </>
  );
};

export function ActionsFactory({ variant = 'edit', isGeneralSettings, ...props }) {
  const { resource, resourceType } = props;
  const { actions } = props.fieldMeta;
  const secondaryActions = ['test', 'validate'];

  const actionButtons = useMemo(() => {
    // if props has defined actions return it

    if (actions) return actions;
    let actionButtons;

    // eslint-disable-next-line brace-style
    if (isGeneralSettings) { actionButtons = ['save', 'cancel']; }
    else actionButtons = ['save', 'saveandclose', 'cancel'];
    // When action button metadata isn't provided we infer the action buttons.
    if (resourceType === 'connections' && resource?.type !== 'other') {
      actionButtons = ['testandsave', 'testsaveandclose', 'cancel', 'test'];
    }

    return actionButtons.map(id => ({
      id,
      mode: secondaryActions.includes(id) ? 'secondary' : 'primary',
    }));
  }, [actions, isGeneralSettings, resource?.type, resourceType, secondaryActions]);

  if (variant === 'view') {
    return <DynaForm {...props} />;
  }

  return (
    <DynaForm {...props} isResourceForm>
      <ActionButtons actions={actionButtons} formProps={props} />
    </DynaForm>
  );

  // // When action buttons is provided in the metadata then we generate the action buttons for you
  // if (actions) {
  //   const ActionButtons =
  //     actions.length > 0 &&
  //     actions.map(action => {
  //       const Action = consolidatedActions[action.id];

  //       return <Action key={action.id} {...props} {...action} />;
  //     });

  //   return <DynaForm {...props}>{ActionButtons}</DynaForm>;
  // }

  // let actionButtons = ['save', 'cancel'];

  // if (resourceType === 'integrations') {
  //   actionButtons = ['save'];
  // } else if (resourceType === 'connections') {
  //   if (resource.type !== 'other') {
  //     actionButtons = ['test', 'testandsave', 'cancel'];
  //   }
  // }

  // return (
  //   <DynaForm {...props}>
  //     {actionButtons.map(key => {
  //       const Action = consolidatedActions[key];
  //       // remove form disabled prop...
  //       // they dont necessary apply to action button
  //       const { disabled, ...rest } = props;

  //       return <Action key={key} dataTest={key} {...rest} />;
  //     })}
  //   </DynaForm>
  // );
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
      onSubmitComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.submitComplete/* , onSubmitComplete */]);

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
    ssLinkedConnectionId,
  } = props;

  useEffect(() => {
    handleInitForm(
      ssLinkedConnectionId,
      resourceType,
      resourceId,
      flowId,
    );

    return () =>
      handleClearResourceForm(ssLinkedConnectionId, resourceType, resourceId);
  }, [
    flowId,
    handleClearResourceForm,
    handleInitForm,
    isNew,
    lastPatchtimestamp,
    resourceId,
    resourceType,
    ssLinkedConnectionId,
  ]);

  const { optionsHandler, validationHandler } = useMemo(
    () =>
      formFactory.getResourceFormAssets({
        resourceType,
        resource,
        isNew,
        connection,
        ssLinkedConnectionId,
      }),
    [connection, isNew, resource, resourceType, ssLinkedConnectionId]
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
