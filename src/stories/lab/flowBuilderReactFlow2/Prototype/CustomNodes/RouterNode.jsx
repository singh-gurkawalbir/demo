import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { Badge, IconButton } from '@material-ui/core';
import Icon from '../../../../../components/icons/BranchIcon';
import DefaultHandle from './Handles/DefaultHandle';

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
  },
  badge: {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.common.white,
  },
}));

export default function RouterNode({data = {}}) {
  const { routeRecordsTo } = data;
  const badgeContent = routeRecordsTo?.type === 'all_matching_branches' ? 'ALL' : '1ST';
  const classes = useStyles();

  return (
    <div>
      <DefaultHandle type="target" position={Position.Left} />

      <IconButton className={classes.button}>
        <Badge
          badgeContent={badgeContent}
          // overlap="circle"
          color="secondary"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          classes={{colorSecondary: classes.badge}}>
          <Icon />
        </Badge>
      </IconButton>

      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}
