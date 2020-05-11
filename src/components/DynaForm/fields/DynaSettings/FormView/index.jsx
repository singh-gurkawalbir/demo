import { useEffect, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Typography } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import actions from '../../../../../actions';
import DynaForm from '../../../../DynaForm';

export default function FormView({
  resourceId,
  resourceType,
  onFormChange,
  onToggleClick,
  disabled,
}) {
  const dispatch = useDispatch();
  const formState = useSelector(state =>
    selectors.customSettingsForm(state, resourceId)
  );
  const isDeveloper = useSelector(
    state => selectors.userProfile(state).developer
  );

  useEffect(() => {
    // use effect will fire any time formState changes but...
    // Only if the formState is missing do we need to perform an init.
    if (!formState) {
      dispatch(actions.customSettings.formRequest(resourceType, resourceId));
    }
  }, [dispatch, formState, resourceId, resourceType]);

  useEffect(
    () => () => {
      // console.log('cleaned up');
      dispatch(actions.customSettings.formClear(resourceId));
    },
    [dispatch, resourceId]
  );

  if (formState && formState.error) {
    return (
      <Fragment>
        <Typography>{formState.error}</Typography>
        {isDeveloper && (
          <Button variant="contained" onClick={onToggleClick}>
            Toggle form editor
          </Button>
        )}
      </Fragment>
    );
  }

  if (!formState || formState.status === 'request') {
    return <Typography>Initializing form...</Typography>;
  }

  return (
    <Fragment>
      {isDeveloper && (
        <Button variant="contained" onClick={onToggleClick}>
          Toggle form editor
        </Button>
      )}
      <DynaForm
        key={formState.key}
        onChange={onFormChange}
        disabled={disabled}
        fieldMeta={formState.meta}
        resourceId={resourceId}
        resourceType={resourceType}
      />
    </Fragment>
  );
}
