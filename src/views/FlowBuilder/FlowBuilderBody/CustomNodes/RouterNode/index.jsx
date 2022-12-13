import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Position } from 'react-flow-renderer';
import { Badge, IconButton, Tooltip, Typography } from '@material-ui/core';
import Icon from '../../../../../components/icons/BranchIcon';
import DefaultHandle from '../Handles/DefaultHandle';
import { useHandleRouterClick } from '../../../hooks';
import CeligoTruncate from '../../../../../components/CeligoTruncate';

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
    top: -45,
    width: '187px',
    height: '38px',
    position: 'absolute',
    background: 'white',
  },
  name: {
    textTransform: 'none',
    fontSize: '15px',
    fontWeight: 600,
    color: theme.palette.text.secondary,
  },
}));

export default function RouterNode({id: routerId, data = {}}) {
  const { routeRecordsTo, name = '' } = data;
  const badgeContent = routeRecordsTo === 'all_matching_branches' ? 'ALL' : '1ST';
  const classes = useStyles();
  const handleRouterClick = useHandleRouterClick(routerId);

  return (
    <div className={classes.container} onClick={handleRouterClick}>
      <div className={classes.nameContainer}>
        <Typography variant="overline" className={classes.name}>
          <CeligoTruncate isLoggable lines={2}>{name}</CeligoTruncate>
        </Typography>
      </div>
      <DefaultHandle type="target" position={Position.Left} />
      <Tooltip title="Edit branching" placement="bottom" aria-label="Edit branching">
        <IconButton
          size="small"
          data-test={`router-${routerId}`}
          className={classes.button}
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
