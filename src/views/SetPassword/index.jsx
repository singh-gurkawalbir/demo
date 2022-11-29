import React, {useState} from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import SetPasswordForm from './setPasswordForm';
import CeligoLogo from '../../components/CeligoLogo';
import { getDomain } from '../../utils/resource';
import messageStore from '../../utils/messageStore';
import { selectors } from '../../reducers';
import MarketingContentWithIframe from '../../components/LoginScreen/MarketingContentWithIframe';

const useStyles = makeStyles(theme => ({
  wrapper: {
    flexGrow: 1,
    display: 'grid',
    gridTemplateColumns: '30% 70%',
    height: '100vh',
    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: '100%',
    },
  },
  marketingContentWrapper: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  logo: {
    width: 150,
    marginBottom: theme.spacing(5),
    '& > svg': {
      fill: theme.palette.primary.dark,
    },
  },
  setPasswordWrapper: {
    background: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  setPasswordContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 300,
    marginTop: '50%',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      marginTop: 0,
    },
  },
  title: {
    marginBottom: theme.spacing(2),
    fontSize: 30,
    lineHeight: '40px',
  },
  setPasswordForm: {
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
  },
}));
export default function SetPassword(props) {
  const classes = useStyles();
  const [setAnchorEl] = useState(null);
  const contentUrl = (getDomain() === 'eu.integrator.io' ? IO_LOGIN_PROMOTION_URL_EU : IO_LOGIN_PROMOTION_URL);
  const handleClick = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.setPasswordWrapper}>
        <div className={classes.setPasswordContent}>
          <div className={classes.logo}>
            <CeligoLogo />
          </div>
          <Typography variant="h3" className={classes.title}>
            Create your password
          </Typography>
          <SetPasswordForm
            {...props}
            dialogOpen={false}
            className={classes.setPasswordForm}
          />
        </div>
      </div>
      <div className={classes.marketingContentWrapper}>
        <MarketingContentWithIframe contentUrl={contentUrl} />
      </div>
    </div>
  );
}
