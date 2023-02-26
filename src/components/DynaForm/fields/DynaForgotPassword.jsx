import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { shallowEqual, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import TextButton from '../../Buttons/TextButton';
import { selectors } from '../../../reducers';
import getRoutePath from '../../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  forgotPass: {
    color: theme.palette.primary.dark,
    textAlign: 'right',
    marginTop: theme.spacing(-2),
  },

}));

export default function DynaForgotPassword({label, formKey, className}) {
  const classes = useStyles();
  const formVal = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);

  return (
    <div className={clsx(classes.forgotPass, className)}>
      <TextButton
        data-test="forgotPassword"
        color="primary"
        component={Link}
        role="link"
        to={formVal?.email ? getRoutePath(`/request-reset?email=${formVal.email}`) : getRoutePath('/request-reset')}>
        {label}
      </TextButton>
    </div>
  );
}
