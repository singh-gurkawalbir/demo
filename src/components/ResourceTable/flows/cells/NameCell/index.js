import React, {useCallback} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Chip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';
import InfoIconButton from '../../../../InfoIconButton';
import { flowbuilderUrl } from '../../../../../utils/flows';
import { selectors } from '../../../../../reducers';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import OfflineConnectionsIcon from '../../../../icons/OfflineConnectionsIcon';

const useStyles = makeStyles(theme => ({
  root: {
    // display: 'flex',
    maxWidth: 300,
    wordWrap: 'break-word',
  },
  connectionIcon: {
    padding: 0,
    color: theme.palette.secondary.main,
    width: theme.spacing(3),
    '&:hover': {
      backgroundColor: theme.palette.background.paper2,
    },
  },
  offlineConnectionsIcon: {
    width: 18,
    color: theme.palette.primary.main,
  },
  flowLink: {
    display: 'inline',
    transition: theme.transitions.create('color'),
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
}));

function OfflineConnectionsIndicator({flowId, flowBuilderTo}) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const isAnyConnectionOffline = useSelectorMemo(selectors.mkIsAnyFlowConnectionOffline, flowId);

  const onOfflineIconClick = useCallback(
    () => {
      dispatch(actions.patchFilter('bottomDrawer', {defaultTab: 'connections'}));
      history.push(flowBuilderTo);
    },
    [dispatch, flowBuilderTo, history]);

  if (!isAnyConnectionOffline) { return null; }

  return (
    <IconButtonWithTooltip
      className={classes.connectionIcon}
      onClick={onOfflineIconClick}
      tooltipProps={{title: 'Connection down', placement: 'bottom'}}
      buttonSize={{size: 'small'}}>
      <OfflineConnectionsIcon className={classes.offlineConnectionsIcon} />
    </IconButtonWithTooltip>
  );
}

export default function NameCell({
  name,
  description,
  isFree,
  flowId,
  isIntegrationApp,
  integrationId,
  childId,
  actionProps,
}) {
  const classes = useStyles();
  const isDataLoader = !!actionProps?.flowAttributes[flowId]?.isDataLoader;
  const flowName = name || `Unnamed (id: ${flowId})`;
  const flowBuilderTo = flowbuilderUrl(flowId, integrationId, {
    childId, isIntegrationApp, appName: actionProps?.appName, isDataLoader, sectionId: actionProps?.sectionId,
  });

  return (
    <div className={classes.root}>
      <Link to={flowBuilderTo}>{flowName}</Link>
      <OfflineConnectionsIndicator flowBuilderTo={flowBuilderTo} flowId={flowId} />
      <InfoIconButton
        info={description}
        escapeUnsecuredDomains
        size="xs"
        title={flowName}
      />

      {isFree && (
        <Chip
          label="Free"
          color="primary"
          size="small"
          className={classes.freeTag}
        />
      )}
    </div>
  );
}
