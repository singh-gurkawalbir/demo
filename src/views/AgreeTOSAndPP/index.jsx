import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { CeligoLogo, FilledButton, TextButton } from '@celigo/fuse-ui';
import DynaCheckbox from '../../components/DynaForm/fields/checkbox/DynaCheckbox';
import getRoutePath from '../../utils/routePaths';
import { selectors } from '../../reducers';
import { HOME_PAGE_PATH } from '../../constants';
import actions from '../../actions';
import messageStore from '../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  wrapper: {
    margin: '0 auto',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
    background: theme.palette.background.paper,
  },
  logo: {
    width: 181,
    paddingTop: theme.spacing(5),
    display: 'inline-flex',
    marginBottom: theme.spacing(5),
    '& > svg': {
      fill: theme.palette.primary.dark,
    },
  },
  link: {
    paddingLeft: 4,
    color: theme.palette.warning.main,
  },
  signinWrapper: {
    background: theme.palette.background.paper,
    width: '550px',
    height: '100vh',
    border: '0px none',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
    overflow: 'inherit !important',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinWrapperContent: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  message: {
    fontSize: 15,
  },
  line: {
    borderTop: `1px solid ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(1, 0),
  },
  topMargin: {
    margin: theme.spacing(3, 0, 0),
  },
  consent: {
    padding: theme.spacing(2, 0),
    '& p.MuiTypography-body1': {
      fontSize: 15,
    },
  },
}));

export default function AgreeTOSAndPP() {
  const classes = useStyles();
  const [agree, setAgree] = useState(false);
  const handleToggle = (_, val) => {
    setAgree(!!val);
  };
  const userAgreedTOSAndPP = useSelector(selectors.userAgreedTOSAndPP);
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (userAgreedTOSAndPP) {
      history.replace(getRoutePath(HOME_PAGE_PATH));
    }
  }, [userAgreedTOSAndPP, history]);

  const handleUserLogout = () => {
    dispatch(actions.auth.logout());
  };
  const handleSubmit = () => {
    dispatch(actions.user.profile.update({ agreeTOSAndPP: true }));
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.signinWrapper}>
        <div className={classes.signinWrapperContent}>
          <div className={classes.logo}>
            <CeligoLogo />
          </div>
          <Typography variant="h3">Review & agree to terms of use</Typography>
          <div className={clsx(classes.line, classes.topMargin)} />
          <Typography variant="body2" className={classes.message}>
            {messageStore('AGREE_TOS_AND_PP')}
          </Typography>
          <DynaCheckbox
            id="agreeTOSAndPP"
            data-test="agreeTOSAndPP"
            className={classes.consent}
            onFieldChange={handleToggle}
            label={(
              <Typography variant="body1">
                I agree to the{' '}
                <a
                  href="https://www.celigo.com/terms-of-service/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Service / Service Subscription Agreement
                </a>{' '}
                and{' '}
                <a
                  href="https://www.celigo.com/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
                .
              </Typography>
            )}
            value={agree}
          />
          <div className={classes.line} />
          <FilledButton
            data-test="agree"
            type="submit"
            disabled={!agree}
            onClick={handleSubmit}
            sx={{
              mr: 2,
              fontSize: '15px',
            }}
            value="Submit"
          >
            Continue
          </FilledButton>
          <TextButton
            data-test="signout"
            color="primary"
            onClick={handleUserLogout}
            sx={{
              fontSize: '15px',
              color: 'inherit',
            }}
          >
            Sign out
          </TextButton>
        </div>
      </div>
    </div>
  );
}
