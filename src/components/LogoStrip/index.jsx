import React from 'react';
import { makeStyles } from '@material-ui/core';
import ApplicationImg from '../icons/ApplicationImg';

const useStyles = makeStyles(theme => ({
  logoStripWrapper: {
    display: 'grid',
    margin: 10,
    maxWidth: 500,
    gridTemplateColumns: applicationsLength => `repeat(${applicationsLength > 5 ? 5 : applicationsLength}, minmax(40px, 60px))`,
    '& > *': {
      justifyContent: 'center',
      position: 'relative',
      display: 'flex',
      height: 40,
      border: '1px solid',
      borderColor: theme.palette.secondary.lightest,
      alignItems: 'center',
      '& > img': {
        maxWidth: '75%',
      },
      '&:nth-child(n)': {
        borderLeft: 'none',
        '&:first-child': {
          borderLeft: '1px solid',
          borderColor: theme.palette.secondary.lightest,
        },
      },
      '&:nth-child(5n+1)': {
        borderLeft: '1px solid',
        borderColor: theme.palette.secondary.lightest,
      },
      '&:nth-child(n+6)': {
        borderTop: 'none',
      },
    },

  },
}));

export default function LogoStrip({applications}) {
  const applicationsLength = applications?.length;
  const classes = useStyles(applicationsLength);

  return (
    <ul className={classes.logoStripWrapper}>
      {applications.map(application => (
        <li key={application}>
          <ApplicationImg
            markOnly
            type="export"
            assistant={application}
           />
        </li>
      ))}
    </ul>
  );
}
