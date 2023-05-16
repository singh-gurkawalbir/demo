import React from 'react';
import clsx from 'clsx';
// eslint-disable-next-line import/no-extraneous-dependencies
import Button from '@mui/material/Button';
import makeStyles from '@mui/styles/makeStyles';
import PropTypes from 'prop-types';
import { FilledButton as FuseUiFilledButton } from '@celigo/fuse-ui';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: props => props.bold ? 'Roboto500' : 'Roboto400',
  },
  error: {
    background: theme.palette.error.main,
    borderColor: theme.palette.error.main,
    color: theme.palette.background.paper,
    '&:hover': {
      background: theme.palette.error.dark,
      borderColor: theme.palette.error.main,
    },
    '&:focus': {
      background: theme.palette.error.dark,
      borderColor: theme.palette.error.main,
    },
  },
  submitBtn: {
    width: '100%',
    borderRadius: 4,
    height: 38,
    fontSize: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
}));

export function SubmitButton({sx, ...rest}) {
  return (
    <FuseUiFilledButton
      sx={[
        {
          width: '100%',
          borderRadius: '4px',
          height: 38,
          fontSize: '16px',
          mt: 1,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...rest}
    />
  );
}

export default function FilledButton(props) {
  const classes = useStyles(props);
  const { error, bold, className, submit, ...rest} = props;

  return (
    <Button
      variant="contained"
      className={clsx(classes.root, {[classes.error]: error}, {[classes.submitBtn]: submit}, className)}
      {...rest} />
  );
}

FilledButton.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  error: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary']),
  bold: PropTypes.bool,
};

FilledButton.defaultProps = {
  color: 'primary',
  size: 'medium',
  disabled: false,
  error: false,
};
