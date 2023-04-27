import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: 5,
    minHeight: 55,
    color: theme.palette.secondary.main,
    cursor: 'pointer',
  },
}));

export default function CardTitle({children}) {
  const classes = useStyles();

  return <div className={classes.root}>{children}</div>;
}

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
};
