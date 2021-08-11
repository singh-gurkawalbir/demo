import React from 'react';
import clsx from 'clsx';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  left: { marginRight: 8, marginLeft: -8 },
  right: { marginLeft: 8, marginRight: -8 },
  root: {
    // Todo (Azhar): please check the impact of padding
    padding: '2px 20px',
    whiteSpace: 'nowrap',
    color: theme.palette.secondary.main,
    fontSize: 14,
    fontFamily: 'Roboto400',
  },
}));
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
      {...rest}
      className={clsx(classes.root, className)}>
      {styledChildren(props.children, classes)}
    </Button>
  );
}
