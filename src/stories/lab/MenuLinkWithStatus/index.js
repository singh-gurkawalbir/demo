import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Typography } from '@material-ui/core';
import SortableHandle from '../../../components/Sortable/SortableHandle';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      '& >*  svg': {
        color: isGripperVisible => isGripperVisible ? theme.palette.primary.main : '',
      },
    },
  },
  name: {
    paddingRight: theme.spacing(1),
  },
}));
export default function MenuLinkWithStatus({name, status, isGripperVisible = false, onMouseEnter, onMouseLeave}) {
  const classes = useStyles(isGripperVisible);

  return (
    <li className={classes.wrapper} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {isGripperVisible && (
        <SortableHandle isVisible={isGripperVisible} />
      )}
      <Typography className={classes.name}>{name}</Typography>
      <span className={classes.status}>{status}</span>
    </li>
  );
}

MenuLinkWithStatus.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.node,
  isGripperVisible: PropTypes.bool,
};
