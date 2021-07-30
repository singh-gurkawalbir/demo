import React, { useCallback, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import actions from '../../actions';
import {selectors} from '../../reducers';
import Spinner from '../Spinner';
import Help from '../Help';
import { OutlinedButton } from '../Buttons';

const useStyles = makeStyles(theme => ({
  spinner: {
    marginRight: theme.spacing(1),
  },
  helpTextButton: {
    padding: 0,
    marginLeft: theme.spacing(1),
  },
  betaLabel: {
    border: '1px solid',
    borderColor: theme.palette.common.white,
    padding: '2px 4px',
    fontSize: 12,
    fontWeight: 700,
    marginLeft: 10,
  },
}));

export default function AutoMapperButton({disabled}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();

  const flowHasExport = useSelector(state => {
    const {flowId} = selectors.mapping(state);

    return !!selectors.firstFlowPageGenerator(state, flowId)?.adaptorType;
  });

  const {failMsg, failSeverity, isFetchingAutoSuggestions} = useSelector(state => {
    const {status, failMsg, failSeverity} = selectors.autoMapper(state);

    return { isFetchingAutoSuggestions: status === 'requested', failMsg, failSeverity};
  }, shallowEqual);

  const handleButtonClick = useCallback(() => {
    dispatch(actions.mapping.autoMapper.request());
    dispatch(
      actions.analytics.gainsight.trackEvent('AUTO_MAP_BUTTON_CLICKED')
    );
  }, [dispatch]);

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
      <OutlinedButton
        data-test="auto-map"
        disabled={disabled || isFetchingAutoSuggestions}
        onClick={handleButtonClick}
      >
        {isFetchingAutoSuggestions &&
          (<Spinner size="small" className={classes.spinner} />)}
        Auto-map fields
        <span className={classes.betaLabel}>
          BETA
        </span>
      </OutlinedButton>

      <Help title="Auto-map fields" helpKey="autoMapFields" className={classes.helpTextButton} />
    </>
  );
}
