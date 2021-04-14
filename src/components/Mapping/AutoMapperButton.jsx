import React, { useCallback, useEffect } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import actions from '../../actions';
import {selectors} from '../../reducers';
import Spinner from '../Spinner';
import Help from '../Help';

const useStyles = makeStyles(theme => ({
  spinner: {
    marginRight: theme.spacing(1),
  },
  helpTextButton: {
    padding: 0,
    marginLeft: theme.spacing(1),
  },
}));

export default function AutoMapperButton({disabled}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();

  const flowHasExport = useSelector(state => {
    const {flowId} = selectors.mapping(state);
    const {adaptorType} = selectors.firstFlowPageGenerator(state, flowId);

    return !!adaptorType;
  });

  const {failMsg, failSeverity, isFetchingAutoSuggestions} = useSelector(state => {
    const {status, failMsg, failSeverity} = selectors.autoMapper(state);

    return { isFetchingAutoSuggestions: status === 'requested', failMsg, failSeverity};
  }, shallowEqual);

  const handleButtonClick = useCallback(() =>
    dispatch(actions.mapping.autoMapper.request()), [dispatch]);

  useEffect(() => {
    if (failMsg) {
      enqueueSnackbar({ message: failMsg, variant: failSeverity || 'error' });
    }
  }, [enqueueSnackbar, failMsg, failSeverity]);

  if (!flowHasExport) {
    return null;
  }

  return (
    <>
      <Button
        color="primary"
        variant="outlined"
        data-test="autoMapper"
        disabled={disabled || isFetchingAutoSuggestions}
        onClick={handleButtonClick}
      >
        {(isFetchingAutoSuggestions) ? (
          <>
            <Spinner size="small" className={classes.spinner} />
            Auto-mapping fields
          </>
        ) : 'Auto-map fields'}
      </Button>

      <Help title="Auto-map fields" helpKey="autoMapFields" className={classes.helpTextButton} />
    </>
  );
}
