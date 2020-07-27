import React, { useMemo, useState } from 'react';
import {useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import resourceConstants from '../../../../forms/constants/connection';
import { getResourceSubType, multiStepSaveResourceTypes } from '../../../../utils/resource';
import consolidatedActions from '../../../ResourceFormFactory/Actions';
import * as selectors from '../../../../reducers';

const getConnectionType = resource => {
  const { assistant, type } = getResourceSubType(resource);

  if (assistant) return assistant;

  return type;
};

const useStyles = makeStyles(theme => ({
  actions: {
    padding: theme.spacing(2, 0),
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    display: 'flex',
    justifyContent: 'space-between'
  }
}));
/**
 * We use primary and secondary actions to differentiate two sets of buttons we use for forms
 * primary - save, save&close, cancel
 * secondary - test, validate, ...other sort of actions
 * TODO @Surya: Revisit this once form refactor is done
 */

const ActionButtons = ({actions, formProps, proceedOnChange, consolidatedActions}) => {
  const classes = useStyles();

  const [disableSaveOnClick, setDisableSaveOnClick] = useState(false);

  const {primaryActions,
    secondaryActions} = useMemo(() => actions.reduce((acc, action) => {
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
        setDisableSaveOnClick
      };
    }
    // remove form disabled prop...
    // they dont necessary apply to action button
    const { disabled, ...rest } = formProps;
    const actionContainer = <Action
      key={action.id}
      dataTest={action.id}
      proceedOnChange={proceedOnChange}
      {...rest}
      {...action}
      {...actionProps}
      />;
    if (action.mode === 'secondary') {
      acc.secondaryActions.push(actionContainer);
    } else {
      acc.primaryActions.push(actionContainer);
    }
    return acc;
  }, {
    primaryActions: [],
    secondaryActions: []

  }), [actions, consolidatedActions, disableSaveOnClick, formProps, proceedOnChange]);

  return (
    <div className={classes.actions}>
      {primaryActions?.length && <div> {primaryActions} </div>}
      {secondaryActions?.length && <div> { secondaryActions }</div>}
    </div>
  );
};

function ActionsFactory({ variant = 'edit', consolidatedActions, ...props }) {
  const { resource, resourceType, resourceId, isNew} = props;
  const connectionType = getConnectionType(resource);
  const isMultiStepSaveResource = multiStepSaveResourceTypes.includes(resourceType);
  // Any extra actions other than Save, Cancel which needs to be separated goes here
  const formState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)
  );
  const { actions, fieldMap } = formState?.fieldMeta || {};

  const actionButtons = useMemo(() => {
    const secondaryActions = ['test', 'validate'];

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
    return actionButtons.map(id => ({
      id,
      mode: secondaryActions.includes(id) ? 'secondary' : 'primary'
    }));
  }, [actions, connectionType, isNew, resourceType, isMultiStepSaveResource]);

  if (!formState.initComplete) return null;

  // this prop allows child components to know that the form contains only a single field
  // and the form should proceed to auto submit on field change
  // the field type should implement proper onChange logic
  // as required, this currently only applies to new connection form
  const proceedOnChange = (variant === 'edit' && resourceType === 'connections' && isNew && Object.keys(fieldMap).length === 1);

  return (

    ((!proceedOnChange || actionButtons?.length) &&
    <ActionButtons consolidatedActions={consolidatedActions} actions={actionButtons} formProps={props} />) || null

  );
}

export default function ActionsFactoryWithResourceFormActions(props) {
  return <ActionsFactory consolidatedActions={consolidatedActions} {...props} />;
}
