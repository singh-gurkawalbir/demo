import React, {useCallback} from 'react';
import { Link, useRouteMatch, useHistory, generatePath } from 'react-router-dom';
import { makeStyles, Chip } from '@material-ui/core';
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
    '&:hover': {
      backgroundColor: theme.palette.background.paper2,
    },
  },
  freeTag: {
    margin: theme.spacing(1),
    color: theme.palette.background.paper,
  },
  flowLink: {
    display: 'inline',
    transition: theme.transitions.create('color'),
    '&:hover': {
      color: theme.palette.primary.dark,
    },
  },
}));

function OfflineConnectionsIndicator({flowId}) {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();
  const isAnyConnectionOffline = useSelectorMemo(selectors.mkIsAnyFlowConnectionOffline, flowId);

  const handleTabChange = useCallback(
    () => {
      const path = generatePath(match.path, {
        ...match.params,
        tab: 'connections',
      });

      history.push(path);
    },
    [history, match.params, match.path]);

  if (!isAnyConnectionOffline) { return null; }

  return (
    <IconButtonWithTooltip
      className={classes.connectionIcon}
      onClick={handleTabChange}
      tooltipProps={{title: 'Connection down', placement: 'bottom'}}
      buttonSize={{size: 'small'}}>
      <OfflineConnectionsIcon className={classes.freeTag} />
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
      <OfflineConnectionsIndicator flowId={flowId} />
      <InfoIconButton info={description} escapeUnsecuredDomains size="xs" />

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
