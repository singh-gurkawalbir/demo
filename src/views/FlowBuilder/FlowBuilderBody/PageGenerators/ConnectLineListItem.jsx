import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import React from 'react';

const APP_BLOCK_WIDTH = 285;
const TOP_PADDING = 86;
const useStyles = makeStyles(theme => ({
  seperator: {
    width: 'calc(100% - 275px)',
    position: 'absolute',
    marginLeft: 275,
    top: props => `${TOP_PADDING + APP_BLOCK_WIDTH * props.index}px`,
    borderTop: `3px dotted ${theme.palette.divider}`,
    height: 285,
    borderRight: `3px dotted ${theme.palette.divider}`,
  },
  lastSeperator: {
    borderRight: '0 !important',
    height: 0,
  },

}));
export default function ConnectLineListItem({index, isLastItem}) {
  const classes = useStyles({index});

  return (
    <li
      className={clsx(classes.seperator, {
        [classes.lastSeperator]: isLastItem,
      })} />
  );
}
