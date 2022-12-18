import { makeStyles, Typography, Link } from '@material-ui/core';
import React from 'react';
import { getDomain } from '../../../utils/resource';

const useStyles = makeStyles(theme => ({

  UserSignInPageFooterLink: {
    paddingLeft: theme.spacing(0.5),
  },

}));

export default function UserSignInPageFooter({linkLabel, linkText, link}) {
  const classes = useStyles();

  return (
    <div>
      {getDomain() !== 'eu.integrator.io' && (
        <Typography variant="body2" >
          {linkLabel}
          <Link href={`/{${link}}`} className={classes.UserSignInPageFooterLink}>
            {linkText}
          </Link>
        </Typography>
      )}
    </div>
  );
}
