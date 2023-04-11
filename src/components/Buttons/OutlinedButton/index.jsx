import React from 'react';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  error: {
    borderColor: theme.palette.error.main,
    color: theme.palette.error.main,
    '&:hover': {
      background: theme.palette.background.paper,
      borderColor: theme.palette.error.main,
      color: theme.palette.error.dark,
    },
  },
  googleBtn: {
    borderRadius: 4,
    border: '1px solid',
    borderColor: theme.palette.divider,
    width: '100%',
    // eslint-disable-next-line no-undef
    background: `url(${CDN_BASE_URI}images/googlelogo.png) 10% center no-repeat`,
    backgroundSize: theme.spacing(2),
    height: 38,
    fontSize: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  outlinedButton: {
    borderColor: theme.palette.secondary.lightest,
    color: theme.palette.secondary.light,
  },
}));

export default function OutlinedButton(props) {
  const classes = useStyles();
  const {children, className, error, googleBtn, ...rest} = props;

  return (
    <Button
      variant="outlined"
      className={clsx({[classes.error]: error}, {[classes.googleBtn]: googleBtn}, {[classes.outlinedButton]: props.color === 'secondary'}, className)}
      color="primary"
      disableElevation
      {...rest}>
      {children}
    </Button>
  );
}

OutlinedButton.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  error: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary']),
  googleBtn: PropTypes.bool,
};

OutlinedButton.defaultProps = {
  color: 'primary',
  size: 'medium',
};
