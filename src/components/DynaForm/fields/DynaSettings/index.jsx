import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles, Button, Divider } from '@material-ui/core';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import * as selectors from '../../../../reducers';
import EditDrawer from '../../../AFE/SettingsFormEditor/Drawer';
import FormView from './FormView';
import RawView from './RawView';
import ExpandMoreIcon from '../../../icons/ArrowDownIcon';
import useIntegration from '../../../../hooks/useIntegration';
import FieldHelp from '../../FieldHelp';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';

const emptyObj = {};
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },
  launchButton: {
    marginLeft: theme.spacing(2),
  },
  divider: {
    marginTop: '20px',
    marginBottom: '10px',
  }
}));

export default function DynaSettings(props) {
  const classes = useStyles();
  const {
    id,
    resourceContext,
    disabled,
    onFieldChange,
    label,
    collapsed = true,
  } = props;
  const settingsContainer = {
    // collapsed: true,
    label: label || 'Custom settings',
    fields: ['settings'],
  };
  const { resourceType, resourceId } = resourceContext;
  const [shouldExpand, setShouldExpand] = useState(!collapsed);
  const [drawerKey, setDrawerKey] = useState(0);
  const history = useHistory();
  const match = useRouteMatch();
  const integrationId = useIntegration(resourceType, resourceId);
  const isViewMode = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, integrationId)
  );
  const settingsForm = useSelector(state => {
    const resource = selectors.resource(state, resourceType, resourceId);

    return (resource && resource.settingsForm) || emptyObj;
  });
  const isIAResource = useSelector(state => {
    const r = selectors.resource(state, resourceType, resourceId);
    return !!(r && r._connectorId);
  });

  const isDeveloper = useSelector(
    state => selectors.userProfile(state).developer
  );
  const canPublish = useSelector(
    state => selectors.userProfile(state).allowedToPublish
  );
  const hasSettingsForm = useSelector(state =>
    selectors.hasSettingsForm(state, resourceType, resourceId)
  );
  const toggleEditMode = useCallback(
    e => {
      e.stopPropagation();
      setDrawerKey(drawerKey => drawerKey + 1);
      history.push(`${match.url}/editSettings`);
    },
    [history, match.url]
  );
  const handleSettingFormChange = useCallback(
    (values, isValid) => {
      // TODO: HACK! add an obscure prop to let the validationHandler defined in
      // the formFactory.js know that there are child-form validation errors
      if (!isValid) {
        onFieldChange(id, { ...values, __invalid: true });
      } else {
        onFieldChange(id, values);
      }
      // dispatch(
      //   action.formFieldChange(formId, fieldId, newValue, shouldTouch, isValid)
      // );
    },
    [id, onFieldChange]
  );
  const handleExpandClick = useCallback(() => setShouldExpand(!shouldExpand), [
    shouldExpand,
  ]);
  const handleEditClose = useCallback(() => history.goBack(), [history]);

  // if its an IA resource and cannot publish, then
  // we only show the form view
  let visibleForUser = true;
  if (isIAResource && !canPublish) {
    visibleForUser = false;
  }

  // only developers can see/edit raw settings!
  // thus, if there is no metadata and the user is not a dev, render custom text.
  if ((!isDeveloper || isViewMode || !visibleForUser) && !hasSettingsForm) {
    if (resourceType === 'integrations') {
      return (
        <div>
          <Typography>
            {settingsContainer.label}
          </Typography>
          <Divider className={classes.divider} />
          <span>
            {`You don't have any custom settings for this ${MODEL_PLURAL_TO_LABEL[resourceType]}`}.
          </span>
        </div>
      );
    }
    return null;
  }

  // We are not in edit mode, devs and non-devs alike should see the settings form if it exists.
  return (
  // Always render the edit drawer. This drawer has logic within to not display unless the
  // browser location ends with a specific path.

    <div className={classes.child}>
      <ExpansionPanel
        // eslint-disable-next-line react/no-array-index-key
        expanded={shouldExpand}>
        <ExpansionPanelSummary
          data-test={settingsContainer.label}
          onClick={handleExpandClick}
          expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.label}>
            {settingsContainer.label}
            {isDeveloper && !isViewMode && visibleForUser && (
              <>
                <Button
                  data-test="form-editor-action"
                  variant="outlined"
                  className={classes.launchButton}
                  // color="secondary"
                  onClick={toggleEditMode}>
                  Launch form builder
                </Button>
                <FieldHelp
                  id="settingsForm"
                  resourceType={resourceType}
                  helpKey="settingsForm"
                  label="Settings form builder"
                />
              </>
            )}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails >
          {hasSettingsForm ? (
            <FormView
              resourceId={resourceId}
              resourceType={resourceType}
              disabled={disabled}
              onFormChange={handleSettingFormChange}
            />
          ) : (
            <RawView {...props} />
          )}
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {isDeveloper && !isViewMode && visibleForUser && (
        <EditDrawer
          key={drawerKey}
          editorId={id}
          resourceId={resourceId}
          resourceType={resourceType}
          settingsForm={settingsForm}
          onClose={handleEditClose}
        />
      )}
    </div>
  );
}
