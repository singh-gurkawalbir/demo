import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  logoStripWrapper: {
    display: 'grid',
    margin: 10,
    maxWidth: 500,
    boxSizing: 'content-box',
    gridTemplateColumns: 'repeat(5, minmax(100px, 1fr))',
    '& > *': {
      justifyContent: 'center',
      position: 'relative',
      display: 'flex',
      height: 40,
      border: '1px solid',
      borderColor: theme.palette.secondary.light,
      alignItems: 'center',
      '&:nth-child(n)': {
        borderLeft: 'none',
        '&:first-child': {
          borderLeft: '1px solid',
          borderColor: theme.palette.secondary.light,
        },
      },
      '&:nth-child(5n+1)': {
        borderLeft: '1px solid',
        borderColor: theme.palette.secondary.light,
      },
      '&:nth-child(n+6)': {
        borderTop: 'none',
      },
    },

  },
}));

export default function LogoStrip({count}) {
  console.log(count);

  const convertToNumber = num => {
    Number(num);
  };
  const totalCount = Array.from(String(count), convertToNumber);

  console.log('***TOTAL COUNT', totalCount);

  const classes = useStyles();

  return (

    <ul className={classes.logoStripWrapper}>

      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
    </ul>
  );
}
