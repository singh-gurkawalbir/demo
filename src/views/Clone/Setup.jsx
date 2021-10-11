import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import actions from '../../actions';
import { selectors } from '../../reducers';
import LoadResources from '../../components/LoadResources';
import InstallWizard from '../../components/InstallationWizard';
import getRoutePath from '../../utils/routePaths';
import { HOME_PAGE_PATH } from '../../utils/constants';

export default function Clone(props) {
  const { resourceType, resourceId } = props.match.params;
  const history = useHistory();
  const dispatch = useDispatch();
  const resource =
    useSelector(state => selectors.resource(state, resourceType, resourceId)) ||
    {};
  const installSteps = useSelector(state =>
    selectors.cloneInstallSteps(state, resourceType, resourceId)
  );
  const handleSetupComplete = useCallback(
    (redirectTo, isInstallFailed, environment) => {
      // Incase clone is failed, then redirect to the dashboard
      if (isInstallFailed) {
        history.replace(getRoutePath(HOME_PAGE_PATH));
      } else {
        if (environment) {
          dispatch(
            actions.user.preferences.update({ environment })
          );
        }
        history.push(redirectTo);
      }
      dispatch(actions.template.clearTemplate(`${resourceType}-${resourceId}`));
    },
    [dispatch, history, resourceId, resourceType]
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
