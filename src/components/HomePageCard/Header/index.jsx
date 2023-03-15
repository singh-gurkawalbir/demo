import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles({
  wrapper: {
    width: '100%',
    height: 50,
    display: 'flex',
    marginBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default function Header({ children }) {
  const classes = useStyles();

  return <div className={classes.wrapper}>{children}</div>;
}

Header.propTypes = {
  children: PropTypes.node.isRequired,
};
