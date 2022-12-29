import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useState} from 'react';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import actions from '../../actions';
import { selectors } from '../../reducers';
import { TextButton, FilledButton} from '../../components/Buttons';
import getImageUrl from '../../utils/image';
import FieldMessage from '../../components/DynaForm/fields/FieldMessage';
import messageStore from '../../utils/messageStore';
import Spinner from '../../components/Spinner';

const path = getImageUrl('images/googlelogo.png');

const useStyles = makeStyles(theme => ({
  snackbar: {
    margin: theme.spacing(1),
  },
  submit: {
    width: '100%',
    borderRadius: 4,
    height: 38,
    fontSize: theme.spacing(2),
    marginTop: theme.spacing(4),
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
  },
  errorField: {
    '&:hover': {
      borderColor: theme.palette.error.dark,
    },
    '& > * input': {
      '&:hover': {
        borderColor: theme.palette.error.dark,
      },
      borderColor: theme.palette.error.dark,
    },
  },
  link: {
    paddingLeft: 4,
    color: theme.palette.primary.dark,
  },
  googleBtn: {
    borderRadius: 4,
    width: '100%',
    background: `url(${path}) 15% center no-repeat`,
    backgroundSize: theme.spacing(2),
    height: 38,
    fontSize: 16,
    backgroundColor: theme.palette.background.paper,
  },
  or: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    margin: theme.spacing(2, 0),
    '&:before': {
      content: '""',
      width: '40%',
      borderTop: '1px solid',
      borderColor: theme.palette.secondary.lightest,
    },
    '&:after': {
      content: '""',
      width: '40%',
      borderTop: '1px solid',
      borderColor: theme.palette.secondary.lightest,
    },
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
export default function ForgotPassword({setShowError, email}) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [userEmail, SetuserEmail] = useState(email || '');
  const [showError, SetshowError] = useState(false);
  const [showInvalidEmailError, SetshowInvalidEmailError] = useState(false);
  const [showErrorMsg, SetshowErrorMsg] = useState('EMAIL_EMPTY');
  const resetRequestStatus = useSelector(state => selectors.requestResetStatus(state));
  const resetRequestErrorMsg = useSelector(state => selectors.requestResetError(state));
  const isAuthenticating = resetRequestStatus === 'requesting';

  useEffect(() => {
    if (resetRequestStatus === 'success') {
      setShowError(false);
    } else {
      setShowError(true);
    }
  }, [resetRequestStatus, resetRequestErrorMsg, setShowError]);
  const validateEmail = email =>
    // eslint-disable-next-line no-useless-escape
    email.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

  const handleAuthentication = useCallback(userEmail => {
    dispatch(actions.auth.resetRequest(userEmail));
  }, [dispatch]);
  const handleOnSubmit = useCallback(e => {
    e.preventDefault();
    const email = e?.target?.email?.value || e?.target?.elements?.email?.value;

    if (!email) {
      SetshowErrorMsg('EMAIL_EMPTY');
      SetshowError(true);
    } else {
      if (validateEmail(email)) {
        SetshowInvalidEmailError(false);
        handleAuthentication(email);
      } else {
        SetshowErrorMsg('INVALID_EMAIL');
        SetshowInvalidEmailError(true);
      }
      SetshowError(false);
    }
  }, [handleAuthentication]);
  const handleOnChangeEmail = useCallback(e => {
    SetshowError(false);
    SetuserEmail(e.target.value);
  }, []);

  return (
    <div className={classes.editableFields}>
      <form onSubmit={handleOnSubmit}>
        <TextField
          data-private
          data-test="email"
          id="email"
          variant="filled"
          placeholder="Email*"
          value={userEmail}
          onChange={handleOnChangeEmail}
          className={clsx(classes.textField, {[classes.errorField]: showError || showInvalidEmailError})}
        />
        <FieldMessage errorMessages={showError || showInvalidEmailError ? messageStore(showErrorMsg) : ''} />

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
        <TextButton
          href="/signin"
          data-test="cancel"
          color="primary"
          type="cancel"
          className={classes.submit}
          value="Cancel">
          Cancel
        </TextButton>
      </form>
    </div>
  );
}

