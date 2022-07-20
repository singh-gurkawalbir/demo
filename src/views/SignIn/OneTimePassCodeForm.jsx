import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { FilledButton } from '../../components/Buttons';
import Spinner from '../../components/Spinner';
import actions from '../../actions';

const useStyles = makeStyles(theme => ({
  snackbar: {
    margin: theme.spacing(1),
  },
  submit: {
    width: '100%',
    borderRadius: 4,
    height: 38,
    fontSize: theme.spacing(2),
    marginTop: theme.spacing(1),
  },
  editableFields: {
    textAlign: 'center',
    width: '100%',
    maxWidth: 500,
    marginBottom: 112,
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  relatedContent: {
    textDecoration: 'none',
  },
  textField: {
    width: '100%',
    background: theme.palette.background.paper,
    marginBottom: 10,
  },
  alertMsg: {
    fontSize: 12,
    textAlign: 'left',
    marginLeft: 0,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    marginTop: theme.spacing(-2),
    marginBottom: 0,
    lineHeight: `${theme.spacing(2)}px`,
    '& > svg': {
      fill: theme.palette.error.main,
      fontSize: theme.spacing(2),
      marginRight: 5,
    },
  },
  link: {
    paddingLeft: 4,
    color: theme.palette.primary.dark,
  },
  forgotPass: {
    color: theme.palette.primary.dark,
    textAlign: 'right',
    marginBottom: theme.spacing(3),
  },
  hidden: {
    display: 'none',
  },
  wrapper: {
    textAlign: 'left',
    marginBottom: theme.spacing(2),
  },
  label: {
    display: 'flex',
  },
}));

export default function OneTimePassCodeForm() {
  const classes = useStyles();
  const isAuthenticating = false;
  const dispatch = useDispatch();
  const handleOnSubmit = useCallback(e => {
    e.preventDefault();
    const code = e.target.email.value;
    const trustDevice = e.target.trustDevice.checked;

    console.log(code, trustDevice);
    dispatch(actions.auth.mfaVerify({ code, trustDevice }));
  }, [dispatch]);

  return (
    <div className={classes.editableFields}>
      <form onSubmit={handleOnSubmit}>
        <TextField
          data-private
          data-test="email"
          id="email"
          type="text"
          inputProps={{ maxLength: 6 }}
          variant="filled"
          placeholder="Email"
        //   value={dialogOpen ? userEmail : email}
        //   onChange={handleOnChangeEmail}
          className={classes.textField}
        //   disabled={dialogOpen}
          />
        <Checkbox
        //   checked
          id="trustDevice"
          color="primary"
          className={classes.optionCheckbox}
      />
        Trust this device
        { isAuthenticating ? <Spinner />
          : (
            <FilledButton
              data-test="submit"
              type="submit"
              className={classes.submit}
              value="Submit">
              Submit
            </FilledButton>
          )}
      </form>
    </div>
  );
}
