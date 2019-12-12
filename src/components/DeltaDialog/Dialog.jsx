import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment-timezone';
import { Dialog } from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';
import Delta from '.';

export default function DeltaDilaog({
  flowId,
  closeDialog,
  disabled,
  isDashBoard,
}) {
  // export default class ConfirmDialog extends React.Component {
  const defaults = {
    width: '70vw',
    height: '50vh',
  };
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));
  const onClose = useCallback(() => {
    closeDialog();
  }, [closeDialog]);
  const [state, setState] = useState({
    changeIdentifier: 0,
    lastExportDateTimeLoaded: false,
  });
  const { changeIdentifier, lastExportDateTimeLoaded } = state;
  const dispatch = useDispatch();
  const lastExportDateTime = useSelector(state =>
    selectors.getLastExportDateTime(state, flow._id)
  );
  const fetchLastExportDateTime = useCallback(() => {
    dispatch(actions.flow.requestLastExportDateTime({ flowId: flow._id }));
  }, [dispatch, flow._id]);

  useEffect(() => {
    fetchLastExportDateTime();
  }, [fetchLastExportDateTime]);
  useEffect(() => {
    if (!lastExportDateTimeLoaded && lastExportDateTime) {
      setState({
        changeIdentifier: changeIdentifier + 1,
        lastExportDateTimeLoaded: true,
      });
    }
  }, [
    changeIdentifier,
    fetchLastExportDateTime,
    lastExportDateTime,
    lastExportDateTimeLoaded,
  ]);

  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  const timeZone = preferences && preferences.timezone;
  let startDateVal;

  if (lastExportDateTime) {
    if (
      moment(lastExportDateTime)
        .tz(timeZone)
        .format(`${preferences.dateFormat} ${preferences.timeFormat}`) ===
      'Invalid date'
    ) {
      startDateVal = '';
    } else {
      startDateVal = moment(lastExportDateTime)
        .tz(timeZone)
        .format(`${preferences.dateFormat} ${preferences.timeFormat}`);
    }
  } else {
    startDateVal = '';
  }

  return (
    <Dialog open scroll="paper" maxWidth={false} {...defaults}>
      <Delta
        isDashBoard={isDashBoard}
        flow={flow}
        key={changeIdentifier}
        onClose={onClose}
        startDate={startDateVal}
        disabled={disabled}
        timeZone={timeZone}
        preferences={preferences}
      />
    </Dialog>
  );
}
