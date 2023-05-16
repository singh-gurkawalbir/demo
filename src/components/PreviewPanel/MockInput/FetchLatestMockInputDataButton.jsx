import { Divider } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { TextButton } from '@celigo/fuse-ui';
import InputDataIcon from '../../icons/InputDataIcon';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    marginRight: '1px !important',
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
        ccolor="primary"
        {...props}>
        Fetch latest input data
      </TextButton>
      <Divider orientation="vertical" className={classes.divider} />
    </div>
  );
}
