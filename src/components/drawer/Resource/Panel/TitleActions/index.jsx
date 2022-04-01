import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Divider } from '@material-ui/core';
import { useRouteMatch, useHistory } from 'react-router-dom';
import InstallationGuideIcon from '../../../../icons/InstallationGuideIcon';
import { KBDocumentation } from '../../../../../utils/connections';
import DebugIcon from '../../../../icons/DebugIcon';
import { selectors } from '../../../../../reducers';
import { DRAWER_URL_PREFIX } from '../../../../../utils/rightDrawer';
import {applicationsList} from '../../../../../constants/applications';
import ApplicationImg from '../../../../icons/ApplicationImg';
import { TextButton } from '../../../../Buttons';

const useStyles = makeStyles(theme => ({
  appLogo: {
    padding: theme.spacing(0, 1),
    margin: theme.spacing(-0.5, 0),
  },
  guideWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  guideLink: {
    marginRight: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  guideLinkIcon: {
    marginRight: theme.spacing(0.5),
  },
  debugLogButton: {
    padding: '0px 8px',
    borderRadius: 0,
    borderRight: `1px solid ${theme.palette.secondary.lightest}`,
  },
  appLogoWrapper: {
    position: 'relative',
    display: 'flex',
    marginRight: theme.spacing(1),
  },
  divider: {
    height: 24,
    width: 1,
  },
}));

export default function TitleActions({ flowId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const { id, resourceType, operation } = match.params || {};
  const history = useHistory();
  const applications = applicationsList();
  const isNew = operation === 'add';
  const hasFlowStepLogsAccess = useSelector(state => selectors.hasLogsAccess(state, id, resourceType, isNew, flowId));
  const applicationType = useSelector(state => selectors.applicationType(state, resourceType, id));
  const showApplicationLogo =
    ['exports', 'imports', 'connections'].includes(resourceType) &&
    !!applicationType;
  const app = applications.find(a => a.id === applicationType) || {};
  const flowStepDrawerHandler = useCallback(() => {
    history.push(`${match.url}/${DRAWER_URL_PREFIX}/logs`);
  }, [match.url, history]);

  return (
    <>
      {showApplicationLogo && (
      <div className={classes.guideWrapper}>
        {resourceType === 'connections' && (app.helpURL || KBDocumentation[applicationType]) && (
        <a className={classes.guideLink} href={app.helpURL || KBDocumentation[applicationType]} rel="noreferrer" target="_blank">
          <InstallationGuideIcon className={classes.guideLinkIcon} />
          {app.name || applicationType} connection guide
        </a>
        )}
        {hasFlowStepLogsAccess && (
        <TextButton
          onClick={flowStepDrawerHandler}
          startIcon={<DebugIcon />}
          className={classes.debugLogButton}
          data-test="flowStepLogs">
          View debug logs
        </TextButton>
        )}
        <div className={classes.appLogoWrapper}>
          <ApplicationImg
            className={classes.appLogo}
            size="small"
            type={applicationType}
            alt={applicationType || 'Application image'}
            assistant={app?.assistant}
              />
          <Divider orientation="vertical" className={classes.divider} />
        </div>
      </div>
      )}
    </>
  );
}
