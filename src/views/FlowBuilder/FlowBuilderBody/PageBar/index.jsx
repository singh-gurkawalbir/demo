import { Divider, IconButton, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import actions from '../../../../actions';
import Status from '../../../../components/Buttons/Status';
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
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../../reducers';
import { emptyObject } from '../../../../constants';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import useBottomDrawer from '../../drawers/BottomDrawer/useBottomDrawer';
import { isNewFlowFn, useHandleExitClick, usePatchFlow, usePushOrReplaceHistory } from '../../hooks';
import LastRun from '../../LastRun';
import LineGraphButton from '../../LineGraphButton';
import { message } from '../../../../utils/messageStore';
import { getTextAfterCount } from '../../../../utils/string';
import RetryStatus from '../../RetryStatus';
import RefreshIcon from '../../../../components/icons/RefreshIcon';
import Help from '../../../../components/Help';

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
  )?.merged || emptyObject;

  const isViewMode = useSelector(state => selectors.isFlowViewMode(state, integrationId, flowId));
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

const calcPageBarSubtitleStyles = makeStyles(theme => ({
  subtitle: {
    display: 'flex',
    alignItems: 'center',
  },
  celigoTimeAgo: {
    marginRight: theme.spacing(0.5),
  },
  divider: {
    height: theme.spacing(3),
    margin: theme.spacing(0, 1),
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
  )?.merged || emptyObject;

  const isNewFlow = isNewFlowFn(flowId);

  return (
    <div className={classes.subtitle}>
      <span className={classes.celigoTimeAgo}>Last saved:</span>
      {isNewFlow ? (
        'Never'
      ) : (
        <CeligoTimeAgo date={flow.lastModified} />
      )}
      {isUserInErrMgtTwoDotZero && <LastRun flowId={flowId} />}
      {isUserInErrMgtTwoDotZero && <RetryStatus flowId={flowId} />}
    </div>
  );
};

const tooltipScheduleFlowIncomplete = {
  title: message.FLOWS.INCOMPLETE_FLOW_SCHEDULE_TOOLTIP,
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
  flowToggle: {
    marginRight: 12,
    marginLeft: 12,
    '& > div:first-child': {
      padding: '8px 0px 4px 0px',
    },
  },
  chartsIcon: { marginRight: theme.spacing(3) },
  circle: {
    position: 'relative',
    '& .MuiButtonBase-root': {
      '&:before': {
        content: '""',
        height: theme.spacing(1),
        width: theme.spacing(1),
        borderRadius: '50%',
        backgroundColor: theme.palette.primary.main,
        position: 'absolute',
        top: theme.spacing(1.5),
        right: theme.spacing(1.5),
        display: 'block',
        zIndex: 1,
      },
    },
  },
  helpIcon: {
    padding: 0,
    '& svg': {
      fontSize: theme.spacing(3),
      color: theme.palette.secondary.light,
    },
    '&:hover': {
      background: 'none',
      '& svg': {
        color: theme.palette.primary.main,
      },

    },
  },
  profilePopper: {
    zIndex: theme.zIndex.drawer + 1,
    wordBreak: 'break-word',
    minWidth: 318,
    maxWidth: 320,
    left: '18px !important',
    top: '10px !important',
  },
  profilePopperArrow: {
    left: '276px !important',
  },
  profilePaper: {
    padding: '10px 8px',
  },
  helptextContent: {
    minWidth: 'unset',
    maxWidth: 'unset',
  },
}));

const RunFlowButtonWrapper = ({flowId}) => {
  const [bottomDrawerHeight, setBottomDrawerHeight] = useBottomDrawer();
  const dispatch = useDispatch();
  const handleRunStart = useCallback(() => {
    // Highlights Run Dashboard in the bottom drawer
    dispatch(actions.bottomDrawer.switchTab({ tabType: 'dashboard' }));

    // Raising bottom drawer in cases where console is minimized
    // and user can not see dashboard after running the flow
    if (bottomDrawerHeight < 225) {
      setBottomDrawerHeight(300);
    }
  }, [bottomDrawerHeight, dispatch, setBottomDrawerHeight]);

  return (

    <RunFlowButton flowId={flowId} onRunStart={handleRunStart} />

  );
};

const excludes = ['mapping', 'detach', 'audit', 'schedule'];

const PageBarChildren = ({integrationId, flowId, iconView}) => {
  const classes = pageChildreUseStyles();
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const isSetupInProgress = useSelector(state => selectors.isFlowSetupInProgress(state, flowId));

  const allowSchedule = useSelectorMemo(selectors.mkFlowAllowsScheduling, flowId);

  const showIconViewToggle = Boolean(process.env.ICON_VIEW_FLOWBUILDER);

  const pushOrReplaceHistory = usePushOrReplaceHistory();

  const handleDrawerOpen = useCallback(
    path => {
      pushOrReplaceHistory(buildDrawerUrl({ path, baseUrl: match.url }));
    },
    [match.url, pushOrReplaceHistory]
  );

  const handleDrawerClick = useCallback(
    path => () => {
      handleDrawerOpen(path);
    },
    [handleDrawerOpen]
  );

  const flowDetails = useSelectorMemo(selectors.mkFlowDetails, flowId, match.params?.childId);
  const isDataLoaderFlow = useSelector(state => selectors.isDataLoaderFlow(state, flowId));
  const isMonitorLevelAccess = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, integrationId)
  );

  const isIAType = !!flowDetails?._connectorId;
  const handleExitClick = useHandleExitClick();
  const isNewFlow = isNewFlowFn(flowId);
  const tooltipSchedule = {
    title: `${flowDetails?.schedule ? 'Edit' : 'Add'} schedule`,
    placement: 'bottom',
  };
  const tooltipIconView = {
    title: iconView !== 'icon' ? 'Swith to iconic view' : 'Swith to bubble view',
    placement: 'bottom',
  };

  const handleViewChange = () => {
    dispatch(actions.flow.toggleSubFlowView(flowId, false));
    if (iconView === 'icon') { dispatch(actions.flow.iconView(flowId, 'bubble')); } else {
      dispatch(actions.flow.iconView(flowId, 'icon'));
    }
  };

  return (
    <div className={classes.actions}>
      {(showIconViewToggle && (
        <>
          {(iconView === 'icon' && (
          <Help
            title="How to operate?" className={classes.helpIcon} disablePortal={false} placement="left-start"
            helpKey="flowbuilder.iconView" />
          ))}
          <IconButtonWithTooltip
            onClick={handleViewChange}
            data-test="flowSettings"
            tooltipProps={tooltipIconView}>
            <RefreshIcon />
          </IconButtonWithTooltip>
        </>
      ))}
      {isUserInErrMgtTwoDotZero && (
      <LineGraphButton flowId={flowId} onClickHandler={handleDrawerClick} />
      )}
      {!isDataLoaderFlow && (
        <div className={clsx(classes.flowToggle)}>
          <FlowToggle
            integrationId={integrationId}
            flowId={flowId}
            childId={match.params?.childId}
            disabled={isNewFlow || isMonitorLevelAccess}
            isConnector={isIAType}
            data-test="switchFlowOnOff"
        />
        </div>
      )}

      <RunFlowButtonWrapper flowId={flowId} />
      {(isNewFlow || isSetupInProgress || allowSchedule) && (
        <div className={clsx(!!flowDetails.schedule && classes.circle)}>
          <IconButtonWithTooltip
            tooltipProps={isSetupInProgress ? tooltipScheduleFlowIncomplete : tooltipSchedule}
            disabled={isNewFlow || isSetupInProgress}
            data-test="scheduleFlow"
            onClick={handleDrawerClick(drawerPaths.FLOW_BUILDER.SCHEDULE)}>
            <CalendarIcon />
          </IconButtonWithTooltip>
        </div>
      )}
      <IconButtonWithTooltip
        tooltipProps={tooltipSettings}
        disabled={isNewFlow}
        onClick={handleDrawerClick(drawerPaths.FLOW_BUILDER.SETTINGS)}
        data-test="flowSettings">
        <SettingsIcon />
      </IconButtonWithTooltip>

      {!isIAType && (
        <FlowEllipsisMenu
          flowId={flowId}
          exclude={excludes}
        />
      )}
      <Divider orientation="vertical" className={classes.divider} />
      <IconButton onClick={handleExitClick} size="small">
        <CloseIcon />
      </IconButton>
    </div>
  );
};
const pageBarUseStyles = makeStyles(({
  errorStatus: {
    marginRight: 12,
  },

}));

const TotalErrors = ({flowId}) => {
  const classes = pageBarUseStyles();
  const totalErrors = useSelector(state => selectors.totalOpenErrors(state, flowId));

  if (!totalErrors) {
    return null;
  }

  return (
    <Status variant="error" size="small" className={classes.errorStatus}>
      <span>{getTextAfterCount('error', totalErrors)}</span>
    </Status>
  );
};

export default function PageBar({flowId, integrationId}) {
  const description = useSelector(state => {
    const flow = selectors.resourceData(state, 'flows',
      flowId
    ).merged;

    return flow?.description;
  });
  const iconView = useSelector(state =>
    selectors.fbIconview(state, flowId)
  );

  return (
    <CeligoPageBar
      title={(<CalcPageBarTitle flowId={flowId} integrationId={integrationId} />)}
      subtitle={<CalcPageBarSubtitle flowId={flowId} />}
      infoText={description}
      escapeUnsecuredDomains
    >
      <TotalErrors flowId={flowId} />
      <PageBarChildren
        flowId={flowId} integrationId={integrationId} iconView={iconView}
      />
    </CeligoPageBar>
  );
}
