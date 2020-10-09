import { IconButton, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import CeligoPageBar from '../../../../components/CeligoPageBar';
import CeligoTimeAgo from '../../../../components/CeligoTimeAgo';
import EditableText from '../../../../components/EditableText';
import FlowEllipsisMenu from '../../../../components/FlowEllipsisMenu';
import FlowToggle from '../../../../components/FlowToggle';
import IconButtonWithTooltip from '../../../../components/IconButtonWithTooltip';
import CalendarIcon from '../../../../components/icons/CalendarIcon';
import CloseIcon from '../../../../components/icons/CloseIcon';
import SettingsIcon from '../../../../components/icons/SettingsIcon';
import RunFlowButton from '../../../../components/RunFlowButton';
import StatusCircle from '../../../../components/StatusCircle';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import useBottomDrawer from '../../drawers/BottomDrawer/useBottomDrawer';
import { isNewFlowFn, useHandleExitClick, useIsDataLoaderFlow, useIsIAType, useIsViewMode, usePatchFlow, usePushOrReplaceHistory } from '../../hooks';
import LastRun from '../../LastRun';
import LineGraphButton from '../../LineGraphButton';

const calcPageBarTitleStyles = makeStyles(theme => ({
  editableTextInput: {
    width: `calc(100vw - ${52 + 410}px)`,
  },
  editableTextInputShift: {
    width: `calc(100vw - ${theme.drawerWidth + 410}px)`,
  },
}));
const CalcPageBarTitle = ({integrationId, flowId}) => {
  const classes = calcPageBarTitleStyles();
  const patchFlow = usePatchFlow(flowId);
  const handleTitleChange = useCallback(
    title => {
      patchFlow('/name', title);
    },
    [patchFlow]
  );

  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  ).merged;

  const isViewMode = useIsViewMode(integrationId, flowId);
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  return (
    <EditableText
      disabled={isViewMode}
      text={flow.name}
            // multiline
      defaultText={isNewFlowFn(flowId) ? 'New flow' : `Unnamed (id:${flowId})`}
      onChange={handleTitleChange}
      inputClassName={
              drawerOpened
                ? classes.editableTextInputShift
                : classes.editableTextInput
            }
          />
  );
};

const calcPageBarSubtitleStyles = makeStyles(({
  subtitle: {
    display: 'flex',
  },
}));
const CalcPageBarSubtitle = ({flowId}) => {
  const classes = calcPageBarSubtitleStyles();
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  ).merged;

  const isNewFlow = isNewFlowFn(flowId);

  return (
    <div className={classes.subtitle}>
      Last saved:{' '}
      {isNewFlow ? (
        'Never'
      ) : (
        <CeligoTimeAgo date={flow.lastModified} />
      )}
      {isUserInErrMgtTwoDotZero && <LastRun flowId={flowId} />}
    </div>
  );
};

const tooltipSchedule = {
  title: 'Schedule',
  placement: 'bottom',
};
const tooltipSettings = {
  title: 'Settings',
  placement: 'bottom',
};

const pageChildreUseStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
    alignItems: 'center',
    margin: [[-7, 0]],
  },

  divider: {
    width: 1,
    height: 30,
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    margin: 5,
  },
  flowToggle: {
    marginRight: 12,
    marginLeft: theme.spacing(1),
    '& > div:first-child': {
      padding: '8px 0px',
    },
  },

}));
const PageBarChildren = ({integrationId, flowId, setTabValue}) => {
  const classes = pageChildreUseStyles();
  const match = useRouteMatch();
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

  const allowSchedule = useSelectorMemo(selectors.mkFlowAllowsScheduling, flowId);

  const pushOrReplaceHistory = usePushOrReplaceHistory();
  const [bottomDrawerHeight, setBottomDrawerHeight] = useBottomDrawer();

  const handleDrawerOpen = useCallback(
    path => {
      pushOrReplaceHistory(`${match.url}/${path}`);
    },
    [match.url, pushOrReplaceHistory]
  );
  const excludes = ['mapping', 'detach', 'audit', 'schedule'];

  const handleRunStart = useCallback(() => {
    // Highlights Run Dashboard in the bottom drawer
    setTabValue(0);

    // Raising bottom drawer in cases where console is minimized
    // and user can not see dashboard after running the flow
    if (bottomDrawerHeight < 225) {
      setBottomDrawerHeight(300);
    }
  }, [setTabValue, bottomDrawerHeight, setBottomDrawerHeight]);
  const handleDrawerClick = useCallback(
    path => () => {
      handleDrawerOpen(path);
    },
    [handleDrawerOpen]
  );

  const flowDetails = useSelectorMemo(selectors.mkFlowDetails, flowId);

  const isDataLoaderFlow = useIsDataLoaderFlow(flowId);
  const isMonitorLevelAccess = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, integrationId)
  );

  const isIAType = useIsIAType(flowId);
  const handleExitClick = useHandleExitClick();
  const isNewFlow = isNewFlowFn(flowId);

  return (
    <div className={classes.actions}>
      {isUserInErrMgtTwoDotZero && (
      <LineGraphButton flowId={flowId} onClickHandler={handleDrawerClick} />
      )}
      {!isDataLoaderFlow && (
        <div className={clsx(classes.chartsIcon, classes.flowToggle)}>
          <FlowToggle
            integrationId={integrationId}
            resource={flowDetails}
            disabled={isNewFlow || isMonitorLevelAccess}
            isConnector={isIAType}
            data-test="switchFlowOnOff"
        />
        </div>
      )}

      <RunFlowButton flowId={flowId} onRunStart={handleRunStart} />
      {allowSchedule && (
        <IconButtonWithTooltip
          tooltipProps={tooltipSchedule}
          disabled={isNewFlow}
          data-test="scheduleFlow"
          onClick={handleDrawerClick('schedule')}>
          <CalendarIcon />
        </IconButtonWithTooltip>
      )}
      <IconButtonWithTooltip
        tooltipProps={tooltipSettings}
        disabled={isNewFlow}
        onClick={handleDrawerClick('settings')}
        data-test="flowSettings">
        <SettingsIcon />
      </IconButtonWithTooltip>

      {!isIAType && (
        <FlowEllipsisMenu
          flowId={flowId}
          exclude={excludes}
        />
      )}
      <div className={classes.divider} />
      <IconButton onClick={handleExitClick} size="small">
        <CloseIcon />
      </IconButton>
    </div>
  );
};
const pageBarUseStyles = makeStyles(({
  errorStatus: {
    justifyContent: 'center',
    height: 'unset',
    display: 'flex',
    alignItems: 'center',
    marginRight: 12,
    fontSize: '12px',
  },

}));

export default function PageBar({flowId, integrationId, setTabValue}) {
  const classes = pageBarUseStyles();
  const {

    total: totalErrors = 0,
  } = useSelector(state => selectors.errorMap(state, flowId));
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  ).merged;

  return (
    <CeligoPageBar
      title={(
        <CalcPageBarTitle

          flowId={flowId} integrationId={integrationId} />
)}
      subtitle={<CalcPageBarSubtitle flowId={flowId} />}
      infoText={flow.description}>
      {totalErrors ? (
        <span className={classes.errorStatus}>
          <StatusCircle variant="error" size="small" />
          <span>{totalErrors} errors</span>
        </span>
      ) : null}
      <PageBarChildren

        flowId={flowId} integrationId={integrationId}
        setTabValue={setTabValue}

        />
    </CeligoPageBar>
  );
}
