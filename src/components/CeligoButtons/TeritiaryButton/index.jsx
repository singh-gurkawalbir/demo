import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    color: props => props.color === 'secondary' ? theme.palette.primary.main : '',
    fontFamily: props => props.fontWeight === 'bold' ? 'source sans pro semibold' : 'source sans pro',
  },
  /* Note: we haven't added any sizes to the buttons into our theme,
    ideally, we should set the button sizes for every variant, because on many places we are overriding the font sizes with line-height. This will help us to showcase the buttons stories into the storybook */

}));

export default function TeritiaryButton(props) {
  const classes = useStyles(props);
  const {children, color, fontWeight, startIcon, endIcon, size, ...rest} = props;

  return (
    <Button
      variant="text"
      color={color}
      className={clsx(classes.root, classes[size])}
      startIcon={startIcon}
      endIcon={endIcon}
      {...rest}>
      {children}
    </Button>
  );
}

TeritiaryButton.propTypes = {
  children: PropTypes.node.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fontWeight: PropTypes.oneOf(['light', 'bold']),
  onClick: PropTypes.func,
};
TeritiaryButton.defaultProps = {
  color: 'primary',
  size: 'medium',
  fontWeight: 'light',
};
