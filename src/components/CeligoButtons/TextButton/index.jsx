import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

export default function TextButton(props) {
  const {children, error, ...rest} = props;

  return (
    <Button
      variant="text"
      color="primary"
      disableElevation
      {...rest}>
      {children}
    </Button>
  );
}

TextButton.propTypes = {
  disabled: PropTypes.bool,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

TextButton.defaultProps = {
  color: 'primary',
  size: 'medium',
};
