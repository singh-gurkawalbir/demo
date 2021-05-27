import React from 'react';
import Button from '@material-ui/core/Button';
import {makeStyles} from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  root: {
    fontFamily: props => props.bold ? 'Source sans pro semibold' : 'Source sans pro',
  },
});
export default function TextButton(props) {
  const classes = useStyles(props);
  const {children, error, ...rest} = props;

  return (
    <Button
      variant="text"
      color="primary"
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
};

TextButton.defaultProps = {
  color: 'primary',
  size: 'medium',
};
