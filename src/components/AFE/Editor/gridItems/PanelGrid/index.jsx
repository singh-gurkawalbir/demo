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

function PanelGrid(props, ref) {
  const { children, onMouseUp, onMouseMove, className } = props;
  const classes = useStyles();

  return (
    <div
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      ref={ref}
      className={clsx(classes.gridContainer, className)}>
      {children}
    </div>
  );
}

export default forwardRef(PanelGrid);
