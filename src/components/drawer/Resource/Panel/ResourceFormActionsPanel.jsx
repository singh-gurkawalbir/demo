import React, { useMemo} from 'react';
import {shallowEqual, useSelector} from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import resourceConstants from '../../../../forms/constants/connection';
import { getResourceSubType, multiStepSaveResourceTypes } from '../../../../utils/resource';
import consolidatedActions from '../../../ResourceFormFactory/Actions';
import { selectors } from '../../../../reducers';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import RenderActionButtonWhenVisible from '../../../DynaForm/RenderActionButtonWhenVisible';
import useTriggerCancelFromContext from '../../../SaveAndCloseButtonGroup/hooks/useTriggerCancelFromContext';

const getConnectionType = resource => {
  const { assistant, type } = getResourceSubType(resource);

  if (assistant) return assistant;

  return type;
};

const useStyles = makeStyles(theme => ({
  actions: {
    padding: theme.spacing(2, 3),
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    display: 'flex',
    justifyContent: 'space-between',
    background: theme.palette.background.paper,
  },
}));
/**
 * We use primary and secondary actions to differentiate two sets of buttons we use for forms
 * primary - save, save&close, cancel
 * secondary - test, validate, ...other sort of actions
 * TODO @Surya: Revisit this once form refactor is done
 */

const ActionButtons = ({actions, formProps, consolidatedActions}) => {
  const classes = useStyles();

  const groups = useMemo(() => {
    if (!actions?.length) return null;
    // remove form disabled prop...
    // they dont necessary apply to action button
    const { disabled, ...rest } = formProps;

    return actions.map(({id, ...actionProps}) => {
      const Action = consolidatedActions[id];

      return (
        <RenderActionButtonWhenVisible
          key={id}
          id={id}
          formKey={formProps.formKey}
          >
          <Action
            dataTest={id}
            {...rest}
            {...actionProps}
        />
        </RenderActionButtonWhenVisible>
      );
    });
  }, [actions, consolidatedActions, formProps]);

  if (!actions?.length) { return null; }

  return (
    <div className={classes.actions}>
      {groups}
    </div>
  );
};

function ProceedOnChange({formKey, onCancel}) {
  useTriggerCancelFromContext(formKey, onCancel);

  return null;
}

export function ActionsFactory({ variant = 'edit', consolidatedActions, fieldMap, actions, ...props }) {
  const { resourceType, isNew, onCancel, formKey} = props;

  if (variant === 'view') { return null; }

  // this prop allows child components to know that the form contains only a single field
  // and the form should proceed to auto submit on field change
  // the field type should implement proper onChange logic
  // as required, this currently only applies to new connection form
  const proceedOnChange = (variant === 'edit' && resourceType === 'connections' && isNew && Object.keys(fieldMap).length === 1);

  // hide action buttons when its a new connections form for a single application dropdown

  if (proceedOnChange) { return <ProceedOnChange formKey={formKey} onCancel={onCancel} />; }

  return (

    (actions?.length &&
    <ActionButtons consolidatedActions={consolidatedActions} actions={actions} formProps={props} />) || null

  );
}

export default function ResourceFormActionsPanel(props) {
  const { resourceType, resourceId, isNew, formKey} = props;

  const resource = useSelectorMemo(selectors.makeResourceDataSelector, resourceType, resourceId)?.merged;

  const connectionType = getConnectionType(resource);
  const isMultiStepSaveResource = multiStepSaveResourceTypes.includes(resourceType);
  // Any extra actions other than Save, Cancel which needs to be separated goes here
  const formState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)
  );
  const { actions, fieldMap} = formState?.fieldMeta || {};
  const values = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);
  const iClientGrantType = useSelector(state => selectors.resource(state, 'iClients', values?.['/http/_iClientId'])?.oauth2?.grantType);
  const oauthType = values?.['/http/auth/type'];
  // Any extra actions other than Save, Cancel which needs to be separated goes here

  const actionButtons = useMemo(() => {
    if (oauthType === 'oauth' && resourceType === 'connections' && !isNew && (!iClientGrantType || iClientGrantType === 'authorizecode')) {
      return [{id: 'oauthandcancel', mode: 'group' }];
    }
    // if props has defined actions return it
    if (actions) return actions.map(action => ({...action, mode: 'group'}));

    // When action button metadata isn't provided we infer the action buttons.
    if (resourceType === 'connections' && !isNew) {
      if (resourceConstants.OAUTH_APPLICATIONS.includes(connectionType)) {
        // should close after saving
        return [{id: 'oauthandcancel', mode: 'group' }];
      }

      return [{id: 'testandsavegroup', mode: 'group' }];
    } if (resourceType === 'eventreports') {
      // should close after saving
      return [{id: 'nextandcancel', mode: 'group', submitButtonLabel: 'Run report', closeAfterSave: true}];
    } if (!isNew || (isNew && !isMultiStepSaveResource)) {
      return [{id: 'saveandclosegroup', mode: 'group'}];
    }

    return [{id: 'nextandcancel', mode: 'group', submitButtonLabel: 'Next', closeAfterSave: true}];
  }, [actions, connectionType, isNew, resourceType, isMultiStepSaveResource, oauthType, iClientGrantType]);

  if (!formState.initComplete) return null;

  return <ActionsFactory consolidatedActions={consolidatedActions} fieldMap={fieldMap} actions={actionButtons} {...props} />;
}
