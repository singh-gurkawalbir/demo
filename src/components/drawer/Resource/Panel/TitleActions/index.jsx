import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useRouteMatch, useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { TextButton } from '@celigo/fuse-ui';
import InstallationGuideIcon from '../../../../icons/InstallationGuideIcon';
import { KBDocumentation } from '../../../../../utils/connections';
import DebugIcon from '../../../../icons/DebugIcon';
import { selectors } from '../../../../../reducers';
import { drawerPaths, buildDrawerUrl } from '../../../../../utils/rightDrawer';
import {applicationsList} from '../../../../../constants/applications';
import ApplicationImg from '../../../../icons/ApplicationImg';
import CeligoDivider from '../../../../CeligoDivider';
import { useSelectorMemo } from '../../../../../hooks';

const useStyles = makeStyles(theme => ({
  appLogo: {
    padding: theme.spacing(0, 1),
    margin: theme.spacing(-0.5, 0),
  },
  guideWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  integrationGuide: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(-0.5),
  },
  guideLink: {
    marginRight: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
  },
  guideLinkIcon: {
    marginRight: theme.spacing(0.5),
  },
  appLogoWrapper: {
    position: 'relative',
    display: 'flex',
    marginRight: theme.spacing(1),
    alignItems: 'center',
  },
  divider: {
    height: 24,
    width: 1,
  },
  httpConnectorGuide: {
    marginRight: 0,
    '& $divider': {
      marginLeft: theme.spacing(1),
    },
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
  let applicationType = useSelector(state => selectors.applicationType(state, resourceType, id));
  const showApplicationLogo =
    ['exports', 'imports', 'connections'].includes(resourceType) &&
    !!applicationType;
  const { merged } =
    useSelectorMemo(
      selectors.makeResourceDataSelector,
      resourceType,
      id
    ) || {};
  const mergedFormType = (resourceType === 'connections' && (merged?._httpConnectorId || merged.http?._httpConnectorId)) ? merged.http?.sessionFormType : merged.http?.formType;

  applicationType = mergedFormType === 'http' ? 'http' : applicationType;

  const app = applications.find(a => [a.id, a.assistant].includes(applicationType)) || {};

  const flowStepDrawerHandler = useCallback(() => {
    history.push(buildDrawerUrl({ path: drawerPaths.LOGS.FLOW_STEP_DEBUG, baseUrl: match.url }));
  }, [match.url, history]);

  if (resourceType === 'integrations') {
    const anchorProps = {
      component: 'a',
      target: '_blank',
      href: 'https://docs.celigo.com/hc/en-us/articles/360019292691-Understand-basic-concepts ',
    };

    return (
      <div className={classes.integrationGuide}>
        <TextButton
          {...anchorProps}
          data-test="integrationGuide"
          color="primary"
          startIcon={<InstallationGuideIcon />}>
          Integration guide
        </TextButton>
        <CeligoDivider position="right" />
      </div>
    );
  }

  return (
    <>
      {showApplicationLogo && (
      <div className={classes.guideWrapper}>
        {resourceType === 'connections' && (app.helpURL || KBDocumentation[applicationType]) && (
        <a className={clsx(classes.guideLink, {[classes.httpConnectorGuide]: merged?._httpConnectorId || merged.http?._httpConnectorId})} href={app.helpURL || KBDocumentation[applicationType]} rel="noreferrer" target="_blank">
          <InstallationGuideIcon className={classes.guideLinkIcon} />
          {merged?._httpConnectorId || merged.http?._httpConnectorId
            ? (
              <>
                Connection guide
                <Divider orientation="vertical" className={classes.divider} />
              </>
              )
            : `${app.name || applicationType} connection guide`}
        </a>
        )}
        {hasFlowStepLogsAccess && (
        <TextButton
          onClick={flowStepDrawerHandler}
          startIcon={<DebugIcon />}
          sx={theme => ({
            padding: '0px 8px',
            borderRadius: 0,
            borderRight: `1px solid ${theme.palette.secondary.lightest}`,
          })}
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
