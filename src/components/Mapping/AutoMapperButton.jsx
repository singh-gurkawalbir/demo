import React, { useCallback, useEffect } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Spinner, FilledButton } from '@celigo/fuse-ui';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import actions from '../../actions';
import {selectors} from '../../reducers';
import Help from '../Help';

const useStyles = makeStyles(theme => ({
  betaLabel: {
    border: '1px solid',
    borderColor: theme.palette.background.paper,
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
      <FilledButton
        data-test="auto-map"
        disabled={disabled || isFetchingAutoSuggestions}
        onClick={handleButtonClick}
      >
        {isFetchingAutoSuggestions &&
          (<Spinner size="small" sx={{mr: 1}} />)}
        Auto-map fields
        <span className={classes.betaLabel}>
          BETA
        </span>
      </FilledButton>

      <Help title="Auto-map fields" helpKey="autoMapFields" sx={{ml: 0.5}} />
    </>
  );
}
