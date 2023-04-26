import { useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles(theme => ({
  droppable: {
    strokeDasharray: 4,
    strokeWidth: 2,
    stroke: theme.palette.primary.main,
    fill: theme.palette.primary.lightest,
    width: 33,
    height: 21,
  },
  active: {
    strokeDasharray: 0,
    strokeWidth: 1,
    stroke: theme.palette.primary.main,
    fill: theme.palette.primary.main,
  },
  '@keyframes dash': {
    to: {
      strokeDashoffset: 500,
    },
  },
}));

function DropIcon({isActive}, ref) {
  const theme = useTheme();
  const classes = useStyles();
  const dropIconClassName = clsx(classes.droppable, {[classes.active]: isActive});

  return (
    <div ref={ref} className={classes.icon}>
      <svg
        className={dropIconClassName}
        width="43" height="27" viewBox="0 0 43 27" fill={isActive ? theme.palette.primary.main : 'none'}
        xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M9.73492 0.625C9.71669 0.625 9.69952 0.62828 9.68075 0.62828L9.65823 0.625C7.96558 0.625 6.40594 1.55968 5.58267 3.0672L2.57012 8.58674C1.55861 10.3643 0.967041 12.4211 0.967041 14.6245C0.967041 20.7835 5.48131 25.8576 11.3198 26.625H33.8772C33.8949 26.625 33.9126 26.6217 33.9303 26.6217L33.9539 26.625C35.646 26.625 37.2061 25.6903 38.0289 24.1828L41.0414 18.6633C42.0535 16.8857 42.6445 14.8289 42.6445 12.6255C42.6445 6.46649 38.1302 1.39242 32.2923 0.625H9.73492Z" />
      </svg>
    </div>
  );
}
export default React.forwardRef(DropIcon);

