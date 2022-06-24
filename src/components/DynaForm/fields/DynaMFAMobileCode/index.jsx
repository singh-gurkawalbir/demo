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
  helpTextButton: {
    marginLeft: theme.spacing(0.5),
    height: theme.spacing(2),
    width: theme.spacing(2),
    padding: 0,
    marginRight: theme.spacing(2),
  },
}));

export default function DynaMFAMobileCode(props) {
  const { required, label, id, helpKey, ...rest } = props;
  const classes = useStyles();
  const validationFailed = useSelector(selectors.isMobileCodeVerificationFailed);

  return (
    <FormControl className={classes.container}>
      <div>
        <FormLabel htmlFor={id} required={required} error={!props.isValid || validationFailed}>
          {label}
        </FormLabel>
        <FieldHelp {...props} />
      </div>
      <Typography variant="body2" className={classes.desc}>Enter the 6-digit code from your app and click the <b>Verify</b> button below. </Typography>
      <DynaText {...rest} id={id} />
      <VerifyTag isValid={props.isValid} />
    </FormControl>
  );
}
