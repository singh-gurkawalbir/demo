import React from 'react';
import { makeStyles } from '@material-ui/core';
import ApplicationImg from '../icons/ApplicationImg';

const useStyles = makeStyles(theme => ({
  logoStripWrapper: {
    display: 'grid',
    margin: 10,
    maxWidth: 500,
    gridTemplateColumns: count => count < 5 ? `repeat(${count}, minmax(40px, 1fr))` : 'repeat(5, minmax(40px, 1fr))',
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

export default function LogoStrip({count}) {
  const classes = useStyles(count);
  // This will get replaced with the applications
  const Apps = [
    {
      id: 1,
      name: 'docusign',
    },
    {
      id: 2,
      name: 'salesforce',
    },
    {
      id: 3,
      name: 'rest',
    },
    {
      id: 4,
      name: 'http',
    },
    {
      id: 5,
      name: 'oracle',
    },
    {
      id: 6,
      name: '4castplus',
    },
    {
      id: 7,
      name: 'asana',
    },
    {
      id: 8,
      name: 'magento',
    },
    {
      id: 9,
      name: 'surveymonkey',
    },
    {
      id: 10,
      name: 'amazonmws',
    },
    {
      id: 11,
      name: '3dcart',
    },
    {
      id: 12,
      name: 'accelo',
    },
  ];

  return (
    <ul className={classes.logoStripWrapper}>
      {Apps.slice(0, count).map(application => (
        <li key={application.id}>
          <ApplicationImg
            markOnly
            type="export"
            assistant={application.name}
           />
        </li>
      ))}
    </ul>
  );
}
