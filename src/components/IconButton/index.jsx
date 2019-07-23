import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = () => ({
  right: { marginRight: 6 },
  left: { marginLeft: 6 },
});

// NOTE: This component expects a single child element that is an SvgIcon
function IconButton(props) {
  const { position = 'left', text, children, classes, ...rest } = props;

  return (
    <Button {...rest}>
      {position === 'right' && text}
      {React.cloneElement(props.children, {
        className: classes[position],
      })}
      {position === 'left' && text}
    </Button>
  );
}

export default withStyles(styles)(IconButton);
