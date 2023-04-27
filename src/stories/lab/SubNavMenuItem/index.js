import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SortableHandle from '../../../components/Sortable/SortableHandle';
import Status from '../../../components/Buttons/Status';

const useStyles = makeStyles(theme => ({
  listItemwrapper: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
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

export default function SubNavMenuItem({name, errorCount, isGripperVisible = false, onMouseEnter, onMouseLeave}) {
  const classes = useStyles(isGripperVisible);

  return (
    <ListItem className={classes.listItemwrapper} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {isGripperVisible && (
        <SortableHandle isVisible={isGripperVisible} />
      )}
      <Typography className={classes.name}>{name}</Typography>
      {errorCount && errorCount > 9999 && (
      <Status variant="error" size="mini">
        9999+
      </Status>
      )}
      {errorCount === 0 && (
      <Status variant="success" size="mini" />)}
    </ListItem>
  );
}

SubNavMenuItem.propTypes = {
  name: PropTypes.string.isRequired,
  status: PropTypes.node,
  isGripperVisible: PropTypes.bool,
  errorCount: PropTypes.number,
};
