import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { makeStyles, Divider } from '@material-ui/core';
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
import FormBuilderButton from '../../../FormBuilderButton';

const emptyObj = {};
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },
  divider: {
    marginTop: '20px',
    marginBottom: '10px',
  },
  summaryContainer: {
    width: '100%',
  },
  summaryLabel: {
    flexGrow: 1,
    alignSelf: 'center',
  },
}));

export default function DynaSettings(props) {
  const {
    id,
    resourceContext,
    disabled,
    onFieldChange,
    label = 'Custom settings',
    collapsed = true,
    fieldsOnly = false
  } = props;
  const classes = useStyles();
  const { resourceType, resourceId } = resourceContext;
  const [shouldExpand, setShouldExpand] = useState(!collapsed);
  const [drawerKey, setDrawerKey] = useState(0);
  const history = useHistory();
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
  const handleFormBuilderClick = useCallback(
    () => setDrawerKey(drawerKey => drawerKey + 1), []
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
          <Typography>{label}</Typography>
          <Divider className={classes.divider} />
          <span>
            You don&apos;t have any custom settings for this integration.
          </span>
        </div>
      );
    }
    return null;
  }

  function renderSettings() {
    return (
      <>
        {!hasSettingsForm ? <RawView {...props} /> : <FormView
          resourceId={resourceId}
          resourceType={resourceType}
          disabled={disabled}
          onFormChange={handleSettingFormChange}
      />}
        <EditDrawer
          key={drawerKey}
          editorId={id}
          resourceId={resourceId}
          resourceType={resourceType}
          settingsForm={settingsForm}
          onClose={handleEditClose}
        />
      </>
    );
  }

  if (fieldsOnly) return renderSettings();

  // We are not in edit mode, devs and non-devs alike should see the settings form if it exists.
  return (
    <div className={classes.child}>
      <ExpansionPanel
        expanded={shouldExpand}>
        <ExpansionPanelSummary
          data-test={label}
          className={classes.summaryContainer}
          onClick={handleExpandClick}
          expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.summaryLabel}>{label}</Typography>
          {isDeveloper && !isViewMode && visibleForUser && shouldExpand && (
            <FormBuilderButton onClick={handleFormBuilderClick} />
          )}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails >
          {renderSettings()}
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}
