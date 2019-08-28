import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = () => ({
  left: { marginRight: 8, marginLeft: -8 },
  right: { marginLeft: 8, marginRight: -8 },
  root: {
    padding: '2px 20px',
  },
});
const styledChildren = (children, classes) => {
  let position = 'left';

  return React.Children.map(children, child => {
    let element = child;

    if (typeof child !== 'string') {
      element = React.cloneElement(child, {
        key: 'icon',
        className: classes[position],
      });
    }

    position = 'right';

    return element;
  });
};

function IconButton(props) {
  const { children, classes, ...rest } = props;

  return (
    <Button {...rest} className={classes.root}>
      {styledChildren(props.children, classes)}
    </Button>
  );
}

export default withStyles(styles)(IconButton);
