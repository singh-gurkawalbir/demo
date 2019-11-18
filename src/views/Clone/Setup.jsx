import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import getRoutePath from '../../utils/routePaths';
import InstallWizard from '../../components/InstallationWizard';
import templateUtil from '../../utils/template';

export default function Clone(props) {
  const { resourceType, resourceId } = props.match.params;
  const dispatch = useDispatch();
  const resource =
    useSelector(state => selectors.resource(state, resourceType, resourceId)) ||
    {};
  const installSteps = useSelector(state =>
    selectors.cloneInstallSteps(state, resourceType, resourceId)
  );
  const handleSetupComplete = useCallback(
    createdComponents => {
      dispatch(actions.template.clearTemplate(`${resourceType}-${resourceId}`));
      const dependentResources =
        templateUtil.getDependentResources(createdComponents) || [];

      dependentResources.forEach(res => {
        dispatch(actions.resource.requestCollection(res));
      });

      if (['integrations', 'flows'].includes(resourceType)) {
        // redirect to integration Settings
        const integration = createdComponents.find(
          c => c.model === 'Integration'
        );

        if (integration) {
          props.history.push(
            getRoutePath(`/integrations/${integration._id}/flows`)
          );
        } else {
          props.history.push('/');
        }
      } else {
        props.history.push(getRoutePath(`/${resourceType}`));
      }
    },
    [dispatch, props.history, resourceType, resourceId]
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
