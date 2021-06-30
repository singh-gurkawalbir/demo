import React from 'react';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: props => props.bold ? 'Source sans pro semibold' : 'Source sans pro',
    '&:focus': {
      color: props => props.color === 'secondary' ? theme.palette.text.secondary : theme.palette.primary.main,
    },
  },
}));
export default function TextButton(props) {
  const classes = useStyles(props);
  const {children, error, ...rest} = props;

  return (
    <Button
      variant="text"
      color="secondary"
      className={classes.root}
      bold
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
  bold: PropTypes.bool,
  color: PropTypes.oneOf(['primary', 'secondary']),
};

TextButton.defaultProps = {
  color: 'secondary',
  size: 'medium',
};
