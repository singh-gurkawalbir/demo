import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
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

    if (typeof child !== 'string' && child !== null) {
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
  const classes = useStyles();
  const { children, ...rest } = props;

  return (
    <Button {...rest} className={classes.root}>
      {styledChildren(props.children, classes)}
    </Button>
  );
}

export default IconButton;
