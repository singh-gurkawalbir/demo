import clsx from 'clsx';
import React from 'react';
import { makeStyles, Tooltip } from '@material-ui/core/';
import DiamondIcon from '../../../../components/icons/DiamondIcon';

const useStyles = makeStyles(theme => ({
  icon: {
    width: 34,
    height: 34,
    fill: theme.palette.background.paper,
    stroke: theme.palette.secondary.lightest,
  },
  droppable: {
    strokeDasharray: 4,
    strokeWidth: 2,
    stroke: theme.palette.primary.main,
    fill: theme.palette.primary.lightest,
    '&:hover': {
      strokeDasharray: 0,
      strokeWidth: 1,
      stroke: theme.palette.primary.main,
      fill: theme.palette.primary.main,
    },
  },
  '@keyframes dash': {
    to: {
      strokeDashoffset: 500,
    },
  },
}));

export default function DiamondMergeIcon({isDroppable, className, tooltip, ...rest}) {
  const classes = useStyles();
  const diamondIconClassName = clsx(classes.icon, {[classes.droppable]: isDroppable}, className);

  return (
    tooltip ? (
      <Tooltip title={tooltip} placement="bottom">
        <div>
          <DiamondIcon className={diamondIconClassName} {...rest} />
        </div>
      </Tooltip>
    ) : <DiamondIcon className={diamondIconClassName} {...rest} />
  );
}
