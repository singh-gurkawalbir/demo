import React from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, LinearProgress } from '@mui/material';
import { selectors } from '../../../reducers';
import { getTextAfterCount } from '../../../utils/string';

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(3, 0, 0, 2),
    overflowX: 'auto',
  },
  transferButton: {
    margin: theme.spacing(1),
    textAlign: 'center',
    float: 'right',
  },
  wrapper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    width: '100%',
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(2),
    textAlign: 'left',
    marginBottom: theme.spacing(2),
  },
  progressBar: {
    height: 10,
    borderRadius: 10,
    maxWidth: '75%',
    backgroundColor: theme.palette.secondary.lightest,
  },
  linearProgressWrapper: {
    marginTop: theme.spacing(1),
  },
  itemsList: {
    marginTop: theme.spacing(1),
    listStyle: 'none',
    padding: 0,
    display: 'flex',
    marginBottom: 0,
    '& li': {
      float: 'left',
      paddingRight: theme.spacing(1),
      marginRight: theme.spacing(1),
      borderRight: `1px solid ${theme.palette.secondary.light}`,
      fontSize: 15,
      '&:last-child': {
        borderRight: 'none',
      },
    },
  },
  subHeading: {
    textAlign: 'left',
    marginBottom: theme.spacing(2),
  },
  heading: {
    textAlign: 'left',
    marginBottom: theme.spacing(3),
  },
  bold: {
    fontWeight: 'bold',
  },
  normal: {
    fontWeight: 'normal',
  },
  block: {
    marginBottom: theme.spacing(3),
  },
  linkCompare: {
    marginLeft: theme.spacing(2),
  },
  headingMaster: {
    fontSize: theme.spacing(4),
    fontWeight: 'bold',
    textAlign: 'left',
    padding: theme.spacing(2),
  },
  description: {
    marginTop: theme.spacing(2),
  },

  drawerPaper: {
    width: 600,
    padding: theme.spacing(1),
  },

  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
  link: {
    marginTop: theme.spacing(2),
    fontSize: theme.spacing(2),
  },

  footer: {
    marginTop: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
  },
}));

export default function DIY() {
  const classes = useStyles();
  const platformLicense = useSelector(state => selectors.platformLicense(state));

  // TODO: Ashok, There is  no description in the new mock please check.
  return (
    <>
      <div className={classes.root}>
        <div className={classes.block}>
          <Typography variant="h5" className={classes.subHeading}>
            Details:
          </Typography>
          <div className={classes.wrapper}>
            <Typography variant="h3">
              Edition: {platformLicense.usageTierName}
            </Typography>
            <ul className={classes.itemsList}>
              <li>
                <span className={classes.bold}>Expiration date:</span>{' '}
                {platformLicense.expirationDate}
              </li>
            </ul>
          </div>
        </div>
        <div className={classes.block}>
          <Typography variant="h5" className={classes.subHeading}>
            Current usage:
          </Typography>
          <div className={classes.linearProgressWrapper}>
            <LinearProgress
              color="primary"
              value={platformLicense.currentUsage.usagePercent}
              variant="determinate"
              thickness={10}
              className={classes.progressBar}
              />
          </div>
          <div>
            <span className={classes.bold}>
              {getTextAfterCount('Hour', platformLicense.currentUsage.usedHours)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
