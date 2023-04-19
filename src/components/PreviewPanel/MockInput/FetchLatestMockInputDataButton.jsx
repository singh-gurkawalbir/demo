import { Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import TextButton from '../../Buttons/TextButton';
import InputDataIcon from '../../icons/InputDataIcon';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '1px !important',
  },
  main: {
    fontSize: 16,
    fontFamily: 'source sans pro',
    fontWeight: 400,
    color: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.light,
      '& > * svg': {
        color: theme.palette.primary.light,
      },
    },
  },
  divider: {
    height: 24,
    width: 1,
  },
}));

export default function FetchLatestMockInputDataButton(props) {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <TextButton
        data-test="fetchLatestInputData"
        startIcon={<InputDataIcon />}
        className={classes.main}
        {...props}>
        Fetch latest input data
      </TextButton>
      <Divider orientation="vertical" className={classes.divider} />
    </div>
  );
}
