import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { Badge, IconButton, Tooltip } from '@material-ui/core';
import Icon from '../../../../../components/icons/BranchIcon';
import DefaultHandle from '../Handles/DefaultHandle';
import { useHandleRouterClick } from '../../../hooks';

const useStyles = makeStyles(theme => ({
  container: {
    width: 34,
    height: 34,
  },
  button: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  badgeColor: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.common.white,
  },
  icon: {
    width: 20,
  },
  badgeTextOverride: {
    left: -4,
  },
}));

export default function RouterNode({data = {}}) {
  const { router = {} } = data;
  const { routeRecordsTo, id: routerId } = router;
  const badgeContent = routeRecordsTo === 'all_matching_branches' ? 'ALL' : '1ST';
  const classes = useStyles();
  const handleRouterClick = useHandleRouterClick(routerId);

  return (
    <div className={classes.container} onClick={handleRouterClick}>
      <DefaultHandle type="target" position={Position.Left} />
      <Tooltip title="Edit branching" placement="bottom" aria-label="Edit branching">
        <IconButton
          size="small"
          tooltipProps={{title: 'Edit branching'}}
          data-test={`router-${routerId}`}
          className={classes.button}
        >
          <Badge
            badgeContent={badgeContent}
          // overlap="circle"
            color="secondary"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            classes={{
              colorSecondary: classes.badgeColor,
              anchorOriginBottomLeftRectangle: classes.badgeTextOverride,
            }}>
            <Icon className={classes.icon} />
          </Badge>
        </IconButton>
      </Tooltip>
      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}
