import React from 'react';
import { useSelector } from 'react-redux';
import { FormControl, FormLabel, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../../../reducers';
import DynaText from '../DynaText';
import FieldHelp from '../../FieldHelp';
import VerifyTag from './VerifyTag';

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
  },
  desc: {
    marginBottom: theme.spacing(0.5),
  },
}));

export default function DynaMFAMobileCode(props) {
  const { required, label, id, ...rest } = props;
  const classes = useStyles();
  const validationFailed = useSelector(state => selectors.mobileCodeStatus(state) === 'fail');

  return (
    <FormControl className={classes.container}>
      <FormLabel htmlFor={id} required={required} error={!props.isValid || validationFailed}>
        {label}
      </FormLabel>
      <FieldHelp {...props} />
      <Typography variant="subtitle2" className={classes.desc}>Enter the 6-digit code from your app and click the <b>Verify</b> button below. </Typography>
      <DynaText {...rest} id={id} />
      <VerifyTag isValid={props.isValid} />
    </FormControl>
  );
}
