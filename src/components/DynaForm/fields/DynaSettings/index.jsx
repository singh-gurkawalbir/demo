import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles, Button } from '@material-ui/core';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import * as selectors from '../../../../reducers';
import EditDrawer from '../../../AFE/SettingsFormEditor/Drawer';
import FormView from './FormView';
import RawView from './RawView';
import ExpandMoreIcon from '../../../icons/ArrowRightIcon';
import useIntegration from '../../../../hooks/useIntegration';
import FieldHelp from '../../FieldHelp';

const emptyObj = {};
// TODO: @Azhar, since this is a copied styling from CollapsedComponents, should
// we move this to a common theme?
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
  },
  expPanelSummary: {
    flexDirection: 'row-reverse',
    paddingLeft: 0,
    minHeight: 'unset',
    height: 38,
    display: 'inline-flex',
    '& > .MuiExpansionPanelSummary-expandIcon': {
      padding: 0,
      margin: theme.spacing(-0.5, 0.5, 0, 0),
      '&.Mui-expanded': {
        transform: 'rotate(90deg)',
      },
    },
    '&.Mui-expanded': {
      minHeight: 0,
    },
    '& > .MuiExpansionPanelSummary-content': {
      margin: 0,
      '&.Mui-expanded': {
        margin: 0,
      },
    },
  },
  expansionPanel: {
    boxShadow: 'none',
    background: 'none',
  },
  expDetails: {
    padding: 0,
  },
  launchButton: {
    marginLeft: theme.spacing(2),
  },
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
  const isDeveloper = useSelector(
    state => selectors.userProfile(state).developer
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

  // only developers can see/edit raw settings!
  // thus, if there is no metadata and the user is not a dev, render nothing.
  if ((!isDeveloper || isViewMode) && !hasSettingsForm) return null;

  // We are not in edit mode, devs and non-devs alike should see the settings form if it exists.
  return (
  // Always render the edit drawer. This drawer has logic within to not display unless the
  // browser location ends with a specific path.

    <div className={classes.child}>
      <ExpansionPanel
        className={classes.expansionPanel}
        // eslint-disable-next-line react/no-array-index-key
        expanded={shouldExpand}>
        <ExpansionPanelSummary
          data-test={settingsContainer.label}
          className={classes.expPanelSummary}
          onClick={handleExpandClick}
          expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.label}>
            {settingsContainer.label}
            {isDeveloper && !isViewMode && (
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
        <ExpansionPanelDetails className={classes.expDetails}>
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
      {isDeveloper && !isViewMode && (
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
