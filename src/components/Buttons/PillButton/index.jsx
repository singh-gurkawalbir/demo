import React from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: '17px',
    // color: props => props.fill ? theme.palette.common.white : theme.palette.secondary.light,
    // background: props => props.fill ? theme.palette.primary.main : theme.palette.common.white,
    // borderColor: theme.palette.secondary.lightest,
  },
  fill: {
    borderColor: theme.palette.primary.main,
    background: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover': {
      color: theme.palette.common.white,
      background: theme.palette.primary.light,
    },
  },
}));

export default function PillButton(props) {
  const classes = useStyles(props);
  const {children, fill, ...rest} = props;

  return (
    <Button
      variant="outlined"
      color="secondary"
      className={clsx(classes.root, {[classes.fill]: fill})}
      {...rest}>
      {children}
    </Button>
  );
}

PillButton.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

PillButton.defaultProps = {
  color: 'secondary',
  size: 'medium',
};
