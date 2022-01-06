import React from 'react';
import { makeStyles } from '@material-ui/core';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';
import isLoggableAttr from '../../../../../utils/isLoggableAttr';

const useStyles = makeStyles({
  flexContainer: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  title: { flex: '0 0 auto' },
  panel: { flex: '1 1 100px', minHeight: 50, position: 'relative' },
});

export default function SinglePanelGridItem(props) {
  const {area, title, children, helpKey, ref, isLoggable} = props;
  const classes = useStyles();

  return (
    <PanelGridItem gridArea={area} ref={ref}>
      <div className={classes.flexContainer}>
        <div className={classes.title}>
          <PanelTitle title={title} helpKey={helpKey} />
        </div>
        <div className={classes.panel} {...isLoggableAttr(isLoggable)}>
          {children}
        </div>
      </div>
    </PanelGridItem>
  );
}
