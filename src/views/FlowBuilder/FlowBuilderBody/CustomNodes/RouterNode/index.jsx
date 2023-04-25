import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Position } from 'reactflow';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import Icon from '../../../../../components/icons/BranchIcon';
import DefaultHandle from '../Handles/DefaultHandle';
import { useHandleRouterClick } from '../../../hooks';
import CeligoTruncate from '../../../../../components/CeligoTruncate';
import { useFlowContext } from '../../Context';
import { selectors } from '../../../../../reducers';

const useStyles = makeStyles(theme => ({
  container: {
    width: 34,
    height: 34,
  },
  button: {
    backgroundColor: theme.palette.background.paper,
    border: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  badgeColor: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.background.paper,
  },
  icon: {
    width: 20,
  },
  badgeTextOverride: {
    left: -4,
  },
  nameContainer: {
    top: -25,
    width: theme.spacing(20),
    height: '38px',
    position: 'absolute',
  },
  name: {
    textTransform: 'none',
    fontWeight: 600,
    color: theme.palette.text.secondary,
    background: theme.palette.background.paper,
    whiteSpace: 'nowrap',
    ' & > * br': {
      display: 'none',
    },
  },
}));

export default function RouterNode({id: routerId, data = {}}) {
  const { flowId } = useFlowContext();
  const isFlowSaveInProgress = useSelector(state =>
    selectors.isFlowSaveInProgress(state, flowId)
  );
  const { routeRecordsTo, name = '' } = data;
  const badgeContent = routeRecordsTo === 'all_matching_branches' ? 'ALL' : '1ST';
  const classes = useStyles();
  const handleRouterClick = useHandleRouterClick(routerId);

  return (
    <div className={classes.container}>
      <div className={classes.nameContainer}>
        <CeligoTruncate isLoggable className={classes.name} lines={1}>{name}</CeligoTruncate>
      </div>
      <DefaultHandle type="target" position={Position.Left} />
      <Tooltip title="Edit branching" placement="bottom" aria-label="Edit branching">
        <IconButton
          size="small"
          data-test={`router-${routerId}`}
          className={classes.button}
          onClick={handleRouterClick}
          disabled={isFlowSaveInProgress}
          sx={{padding: '3px', width: 32 }}
        >
          <Badge
            badgeContent={badgeContent}
            color="secondary"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            classes={{
              colorSecondary: classes.badgeColor,
              anchorOriginBottomLeftRectangular: classes.badgeTextOverride,
            }}>
            <Icon className={classes.icon} />
          </Badge>
        </IconButton>
      </Tooltip>
      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}
