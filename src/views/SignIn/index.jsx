import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import classNames from 'classnames';
import SigninForm from './SigninForm';

const useStyles = makeStyles(theme => ({
  appBar: {
    backgroundColor: theme.palette.secondary.light,
    height: 55,
    minHeight: 55,
  },
  celigoLogo: {
    height: 55,
    width: 140,
    background: `url(${process.env.CDN_BASE_URI}flow-builder/celigo-product-logo.svg) no-repeat center left`,
  },
  signin: {
    marginTop: 90,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

export default function Signin(props) {
  const classes = useStyles();

  return (
    <Fragment>
      <AppBar className={classes.appBar}>
        <span className={classNames(classes.celigoLogo)} />
      </AppBar>
      <div className={classes.signin}>
        <SigninForm {...props} dialogOpen={false} />
      </div>
    </Fragment>
  );
}
