import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import LoadResources from '../../../LoadResources';
import InstallWizard from '../../../InstallationWizard';

const emptyObject = {};
const useStyles = makeStyles(theme => ({
  subtitle: {
    marginBottom: theme.spacing(3),
  },
}));

export default function Setup() {
  const match = useRouteMatch();
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = useStyles();
  const { templateId } = match.params;
  // TODO: why is this selector called marketplaceTemplate? its used to also retrieve
  // integration templates...
  const template = useSelector(
    state => selectors.marketplaceTemplate(state, templateId) || emptyObject
  );
  const { runKey } = useSelector(
    state => selectors.templateSetup(state, templateId) || emptyObject
  );
  const installSteps = useSelector(state =>
    selectors.templateInstallSteps(state, templateId)
  );
  const handleSetupComplete = useCallback(
    redirectTo => {
      history.replace(redirectTo);
      dispatch(actions.template.clearTemplate(templateId));
    },
    [dispatch, history, templateId]
  );

  return (
    <LoadResources required resources="connections,integrations">
      <Typography variant="h4">Setup</Typography>
      <Typography className={classes.subtitle}>
        Your installation will begin when you’ve completed the following steps:
      </Typography>
      <InstallWizard
        templateId={templateId}
        variant="new"
        type="template"
        runKey={runKey}
        installSteps={installSteps}
        resource={template}
        handleSetupComplete={handleSetupComplete}
      />
    </LoadResources>
  );
}
