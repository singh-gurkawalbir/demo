import clsx from 'clsx';
import React from 'react';
import { Tooltip } from '@mui/material/';
import makeStyles from '@mui/styles/makeStyles';
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

function DiamondMergeIcon({isDroppable, className, tooltip, ...rest}, ref) {
  const classes = useStyles();
  const diamondIconClassName = clsx(classes.icon, {[classes.droppable]: isDroppable}, className);

  return (
    tooltip ? (
      <Tooltip title={tooltip} placement="bottom">
        <div ref={ref}>
          <DiamondIcon className={diamondIconClassName} {...rest} />
        </div>
      </Tooltip>
    ) : <div ref={ref}><DiamondIcon className={diamondIconClassName} {...rest} /></div>
  );
}
export default React.forwardRef(DiamondMergeIcon);

