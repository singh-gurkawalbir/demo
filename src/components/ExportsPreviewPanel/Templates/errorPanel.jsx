import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {shallowEqual, useSelector} from 'react-redux';
import DefaultPanel from '../../CeligoTabLayout/CustomPanels/DefaultPanel';
import { selectors } from '../../../reducers';

const useStyles = makeStyles(theme => ({
  error: {
    marginTop: theme.spacing(4),
    color: theme.palette.error.main,
  },
}));

const DEFAULT_ERROR = 'No data to show - application responded with an error';

export default function ErrorPanel({resourceId}) {
  const classes = useStyles();
  const parseAllErrors = useSelector(state => selectors.getAllParsableErrors(state, resourceId), shallowEqual);

  if (parseAllErrors) {
    return <DefaultPanel value={parseAllErrors} isLoggable={false} />;
  }

  return <span className={classes.error}> { DEFAULT_ERROR } </span>;
}
