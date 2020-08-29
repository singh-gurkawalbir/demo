import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../..';
import useFormInitWithPermissions from '../../../../../hooks/useFormInitWithPermissions';
import Spinner from '../../../../Spinner';
import SpinnerWrapper from '../../../../SpinnerWrapper';

const useStyles = makeStyles({
  wrapper: {
    width: '100%',
  },
});

export default function FormView({
  resourceId,
  resourceType,
  disabled,
  formKey,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const settingsFormState = useSelector(state =>
    selectors.customSettingsForm(state, resourceId)
  );
  const formState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)
  );

  useEffect(() => {
    // use effect will fire any time formState changes but...
    // Only if the formState is missing do we need to perform an init.
    if (!settingsFormState) {
      dispatch(actions.customSettings.formRequest(resourceType, resourceId));
    }
  }, [dispatch, settingsFormState, resourceId, resourceType]);

  useEffect(
    () => () => {
      // console.log('cleaned up');
      dispatch(actions.customSettings.formClear(resourceId));
    },
    [dispatch, resourceId]
  );

  // TODO:verify this behaviour
  useFormInitWithPermissions({
    formKey,
    remount: settingsFormState?.key,
    disabled,
    fieldMeta: settingsFormState?.meta,
    resourceId,
    resourceType,
    ...formState,
  });

  if (settingsFormState && settingsFormState.error) {
    return (
      <div>
        <Typography>{settingsFormState.error}</Typography>
      </div>
    );
  }

  if (!settingsFormState || settingsFormState.status === 'request') {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }

  return (
    <div className={classes.wrapper}>
      <DynaForm formKey={formKey} fieldMeta={settingsFormState?.meta} />
    </div>
  );
}
