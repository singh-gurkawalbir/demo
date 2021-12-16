import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Divider } from '@material-ui/core';
import { useRouteMatch, useHistory } from 'react-router-dom';
import InstallationGuideIcon from '../../../../icons/InstallationGuideIcon';
import { KBDocumentation } from '../../../../../utils/connections';
import DebugIcon from '../../../../icons/DebugIcon';
import { selectors } from '../../../../../reducers';
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
    alignItems: 'flex-start',
  },
  guideLink: {
    marginRight: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(0.5),
  },
  guideLinkIcon: {
    marginRight: theme.spacing(0.5),
  },
  backButton: {
    marginRight: theme.spacing(1),
    padding: 0,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.secondary.dark,
    },
  },
  nestedDrawerTitleText: {
    maxWidth: '90%',
  },
  titleImgBlock: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  debugLogButton: {
    padding: '0px 8px',
    borderRadius: 0,
    borderRight: `1px solid ${theme.palette.secondary.lightest}`,
  },
  appLogoWrapper: {
    position: 'relative',
    display: 'flex',
    marginRight: theme.spacing(3),
  },
  divider: {
    height: 24,
    width: 1,
  },
  resourcePanelFooter: {
    background: theme.palette.common.white,
  },
}));

export default function TitleActions({ id, resourceType, flowId, isNew }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const applications = applicationsList();
  const hasListenerLogsAccess = useSelector(state => selectors.hasLogsAccess(state, id, resourceType, isNew, flowId));
  const applicationType = useSelector(state => selectors.applicationType(state, resourceType, id));
  const showApplicationLogo =
    ['exports', 'imports', 'connections'].includes(resourceType) &&
    !!applicationType;
  const app = applications.find(a => a.id === applicationType) || {};
  const listenerDrawerHandler = useCallback(() => {
    history.push(`${match.url}/logs`);
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
        {hasListenerLogsAccess && (
        <TextButton
          onClick={listenerDrawerHandler}
          startIcon={<DebugIcon />}
          className={classes.debugLogButton}
          data-test="listenerLogs">
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
