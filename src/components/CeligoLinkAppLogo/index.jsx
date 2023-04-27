import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import LinkIcon from '../icons/LinkIcon';
import ApplicationImg from '../icons/ApplicationImg';

const useStyles = makeStyles(theme => ({
  CeligoWithConnectorLogoWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  logosWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  linkIcon: {
    margin: theme.spacing(0, 2),
    fontSize: theme.spacing(5),
  },
}));

export default function CeligoLinkAppLogo({ application, className }) {
  const classes = useStyles();

  return (
    <div className={clsx(classes.CeligoWithConnectorLogoWrapper, className)}>
      <div className={classes.logosWrapper}>
        <ApplicationImg
          type="other"
          alt="celigo"
          size="small"
        />
        <LinkIcon className={classes.linkIcon} />
        <ApplicationImg
          type={application}
          alt={application}
          size="small"
        />
      </div>
    </div>

  );
}
