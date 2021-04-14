import React from 'react';
import { makeStyles } from '@material-ui/core';
import PanelTitle from '../PanelTitle';
import PanelGridItem from '../PanelGridItem';

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

export default function SinglePanelGridItem({area, title, children, helpKey}) {
  const classes = useStyles();

  return (
    <PanelGridItem gridArea={area}>
      <div className={classes.flexContainer}>
        <div className={classes.title}>
          <PanelTitle title={title} helpKey={helpKey} />
        </div>
        <div className={classes.panel}>
          {children}
        </div>
      </div>
    </PanelGridItem>
  );
}
