import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { Badge, IconButton } from '@material-ui/core';
import Icon from '../../../../../components/icons/BranchIcon';
import DefaultHandle from '../Handles/DefaultHandle';

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
  const { routeRecordsTo } = data;
  const badgeContent = routeRecordsTo?.type === 'all_matching_branches' ? 'ALL' : '1ST';
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <DefaultHandle type="target" position={Position.Left} />

      <IconButton size="small" className={classes.button}>
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

      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}
