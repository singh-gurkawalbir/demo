import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    color: props => props.color === 'primary' ? theme.palette.primary.main : theme.palette.secondary.main,
    fontFamily: props => props.fontWeight === 'bold' ? 'source sans pro semibold' : 'source sans pro',
  },
  /* Note 1: we haven't added any sizes to the buttons into our theme,
    ideally, we should set the button sizes for every variant, because on many places we are overriding the font sizes with line-height. This will help us to showcase the buttons stories into the storybook */
}));

export default function TeritiaryButton(props) {
  const classes = useStyles(props);
  const {children, color = 'primary', fontWeight, startIcon, endIcon, size, ...rest} = props;

  return (
    <Button
      variant="text"
      color={color}
      size={size}
      fontWeight={fontWeight}
      className={clsx(classes.root, classes[size])}
      startIcon={startIcon}
      endIcon={endIcon}
      {...rest}>
      {children}
    </Button>
  );
}

TeritiaryButton.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary']),
  children: PropTypes.node.isRequired,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fontWeight: PropTypes.string,
};
TeritiaryButton.defaultProps = {
  color: 'primary',
  size: 'medium',
  fontWeight: 'light',
};
