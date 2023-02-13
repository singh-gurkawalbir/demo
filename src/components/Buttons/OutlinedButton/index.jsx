import React from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { propTypes } from 'react-json-pretty';

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

}));

export default function OutlinedButton(props) {
  const classes = useStyles();
  const {children, className, error, googleBtn, ...rest} = props;

  return (
    <Button
      variant="outlined"
      className={clsx({[classes.error]: error}, {[classes.googleBtn]: googleBtn}, className)}
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
  googleBtn: propTypes.bool,
};

OutlinedButton.defaultProps = {
  color: 'primary',
  size: 'medium',
};
