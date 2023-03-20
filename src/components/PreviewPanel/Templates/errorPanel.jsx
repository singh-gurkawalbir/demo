import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import {shallowEqual, useSelector} from 'react-redux';
import DefaultPanel from '../../CeligoTabLayout/CustomPanels/DefaultPanel';
import { selectors } from '../../../reducers';
import { message } from '../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  error: {
    marginTop: theme.spacing(4),
    color: theme.palette.error.main,
  },
}));

export default function ErrorPanel({resourceId}) {
  const classes = useStyles();
  const parseAllErrors = useSelector(state => selectors.getAllParsableErrors(state, resourceId), shallowEqual);

  if (parseAllErrors) {
    return <DefaultPanel value={parseAllErrors} isLoggable={false} />;
  }

  return <span className={classes.error}> { message.DEFAULT_ERROR } </span>;
}
