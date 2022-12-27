import React from 'react';

import UserSignInPage from '../../components/UserSignInPage';

const Label = () =>
// const classes = useStyles();

  (
    <>
      Contact an admin or owner of the primary account to reset MFA. Otherwise ,
      <a
        href="https://www.celigo.com/company/contact-us/"
        target="_blank"
        rel="noreferrer"
    >
        contact Celigo support via call.
      </a>
      <br />
      <br />
      Need more help? &nbsp;
      <a
        href="https://docs.celigo.com/hc/en-us/articles/7127009384987-Set-up-multifactor-authentication-MFA-for-an-account"
        target="_blank"
        rel="noreferrer"
    >
        Check out our help documentation.
      </a>
    </>
  );
export default function MfaHelp() {
  return (

    <>
      <UserSignInPage
        pageTitle="Need help authenticating?"
        pageSubHeading={<Label />}
        footerLinkLabel="Don't have an account?"
        footerLinkText="Sign up"
        footerLink="signup"
    />
    </>
  );
}
