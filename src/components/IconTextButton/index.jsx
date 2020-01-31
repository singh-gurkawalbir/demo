import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  left: { marginRight: 8, marginLeft: -8 },
  right: { marginLeft: 8, marginRight: -8 },
  root: {
    padding: '2px 20px',
    whiteSpace: 'nowrap',
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

export default function IconTextButton(props) {
  const classes = useStyles();
  const { children, className, ...rest } = props;

  return (
    <Button
      data-test="iconButton"
      {...rest}
      className={clsx(classes.root, className)}>
      {styledChildren(props.children, classes)}
    </Button>
  );
}
