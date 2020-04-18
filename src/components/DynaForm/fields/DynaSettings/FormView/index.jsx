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
  value,
}) {
  const dispatch = useDispatch();
  // TODO: this is a missing selector to implement. It would return {status, key, meta}
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
      dispatch(
        actions.customSettings.initForm(resourceType, resourceId, value)
      );
    }
  }, [dispatch, formState, resourceId, resourceType, value]);

  if (!formState || formState.status !== 'ready') {
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
      />
    </Fragment>
  );
}
