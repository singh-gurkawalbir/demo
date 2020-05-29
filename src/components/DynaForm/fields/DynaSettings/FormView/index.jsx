import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../../../DynaForm';
import Spinner from '../../../../Spinner';

const useStyles = makeStyles({
  spinnerWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    margin: 'auto',
  },
  wrapper: {
    width: '100%',
  },
});

export default function FormView({
  resourceId,
  resourceType,
  onFormChange,
  disabled,
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

  if (settingsFormState && settingsFormState.error) {
    return (
      <div>
        <Typography>{settingsFormState.error}</Typography>
      </div>
    );
  }

  if (!settingsFormState || settingsFormState.status === 'request') {
    return (
      <div className={classes.spinnerWrapper}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className={classes.wrapper}>
      <DynaForm
        key={settingsFormState.key}
        onChange={onFormChange}
        disabled={disabled}
        fieldMeta={settingsFormState.meta}
        resourceId={resourceId}
        resourceType={resourceType}
        formState={formState}
      />
    </div>
  );
}
