import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import actions from '../../actions';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import InstallWizard from '../../components/InstallationWizard';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';

export default function Clone(props) {
  const { resourceType, resourceId } = props.match.params;
  const history = useHistory();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const dispatch = useDispatch();
  const resource =
    useSelector(state => selectors.resource(state, resourceType, resourceId)) ||
    {};
  const installSteps = useSelector(state =>
    selectors.cloneInstallSteps(state, resourceType, resourceId)
  );
  const handleSetupComplete = useCallback(
    redirectTo => {
      history.push(redirectTo);
      enqueueSnackbar({ message: 'Cloned Successfully!!', variant: 'success' });
      dispatch(actions.template.clearTemplate(`${resourceType}-${resourceId}`));
    },
    [dispatch, enqueueSnackbar, history, resourceId, resourceType]
  );

  return (
    <LoadResources required resources="connections,integrations">
      <InstallWizard
        {...props}
        templateId={`${resourceType}-${resourceId}`}
        type="clone"
        resourceType={resourceType}
        resourceId={resourceId}
        installSteps={installSteps}
        resource={resource}
        handleSetupComplete={handleSetupComplete}
      />
    </LoadResources>
  );
}
