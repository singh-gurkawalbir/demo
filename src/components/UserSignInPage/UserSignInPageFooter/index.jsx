import { Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { TextButton } from '@celigo/fuse-ui';
import { isSignUpAllowed } from '../../../utils/resource';
import getRoutePath from '../../../utils/routePaths';

export default function UserSignInPageFooter({linkLabel, linkText, link}) {
  return (
    <div>
      {isSignUpAllowed() && (
      <Typography variant="body2" >
        {linkLabel}
        <TextButton
          data-test="signupOrSigninFooter"
          sx={{
            paddingLeft: 0.5,
            paddingTop: 0.5,
            textDecoration: 'none',
            fontSize: '15px',
          }}
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
