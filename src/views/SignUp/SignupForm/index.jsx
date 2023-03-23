import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback, useEffect, useMemo} from 'react';
import { Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { SIGN_UP_SUCCESS } from '../../../constants';
import getFieldMeta from './metadata';
import useFormInitWithPermissions from '../../../hooks/useFormInitWithPermissions';
import DynaForm from '../../../components/DynaForm';
import DynaSubmit from '../../../components/DynaForm/DynaSubmit';
import getRoutePath from '../../../utils/routePaths';
import useQuery from '../../../hooks/useQuery';
import { SIGNUP_SEARCH_PARAMS } from '../../../constants/account';

const useStyles = makeStyles(theme => ({
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
}));

function validateQueryParam(params) {
  const validatedParam = {};

  Object.keys(params).forEach(key => {
    if (SIGNUP_SEARCH_PARAMS.includes(key)) {
      validatedParam[key] = params[key];
    }
  });

  return validatedParam;
}

const formKey = 'signupForm';
export default function SignUp() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const userEmail = useSelector(state => selectors.userProfileEmail(state));
  const signupStatus = useSelector(state => selectors.signupStatus(state));
  const error = useSelector(state => selectors.signupMessage(state));
  const query = useQuery();
  const queryParams = Object.fromEntries(query);

  const validatedParam = validateQueryParam(queryParams);

  const handleSignup = useCallback(values => {
    dispatch(actions.auth.signup({...values, ...validatedParam}));
  }, [dispatch, validatedParam]);

  const handleOnSubmit = useCallback(values => {
    handleSignup(values);
  }, [handleSignup]);

  const fieldMeta = useMemo(() => getFieldMeta(userEmail), [userEmail]);

  useFormInitWithPermissions({formKey, fieldMeta});

  useEffect(() => {
    if (signupStatus === 'success') {
      dispatch(actions.auth.signupStatus('done', SIGN_UP_SUCCESS));
      history.replace(getRoutePath('/signin'));
    }
  }, [dispatch, history, signupStatus]);

  return (
    <div className={classes.editableFields}>
      { signupStatus === 'failed' && error && (
        <Typography
          data-private
          color="error"
          component="div"
          variant="h5"
          className={classes.alertMsg}>
          {error}
        </Typography>
      )}
      <DynaForm formKey={formKey} />
      <DynaSubmit
        className={classes.submit}
        formKey={formKey}
        onClick={handleOnSubmit}
        ignoreFormTouchedCheck>
        Sign up
      </DynaSubmit>
    </div>
  );
}
