import React, {forwardRef} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  gridContainer: {
    flexGrow: 1,
    display: 'grid',
    gridGap: theme.spacing(0.5),
    alignItems: 'stretch',
    height: '100%',
  },
}));

function PanelGrid({ children, onMouseUp, onMouseMove, className, style }, ref) {
  const classes = useStyles();

  return (
    <div
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      ref={ref}
      style={style}
      className={clsx(classes.gridContainer, className)}>
      {children}
    </div >
  );
}

export default forwardRef(PanelGrid);
