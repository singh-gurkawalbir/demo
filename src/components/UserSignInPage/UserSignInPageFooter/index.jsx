import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { Link } from 'react-router-dom';
import { isSignUpAllowed } from '../../../utils/resource';
import getRoutePath from '../../../utils/routePaths';
import { TextButton } from '../../Buttons';

const useStyles = makeStyles(theme => ({

  UserSignInPageFooterLink: {
    paddingLeft: theme.spacing(0.5),
    paddingTop: theme.spacing(0.5),
    textDecoration: 'none',
    fontSize: 15,
  },

}));

export default function UserSignInPageFooter({linkLabel, linkText, link}) {
  const classes = useStyles();

  return (
    <div>
      {isSignUpAllowed() && (
      <Typography variant="body2" >
        {linkLabel}
        <TextButton
          data-test="signupOrSigninFooter"
          className={classes.UserSignInPageFooterLink}
          color="primary"
          component={Link}
          role="link"
          to={getRoutePath(`/${link}`)}>
          {linkText}
        </TextButton>
      </Typography>
      )}
    </div>
  );
}
