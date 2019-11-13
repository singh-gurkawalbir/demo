import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import getRoutePath from '../../utils/routePaths';
import InstallWizard from '../../components/InstallationWizard';

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
      dispatch(actions.resource.requestCollection('integrations'));
      dispatch(actions.resource.requestCollection('flows'));
      dispatch(actions.resource.requestCollection('connections'));
      dispatch(actions.resource.requestCollection('exports'));
      dispatch(actions.resource.requestCollection('imports'));
      dispatch(actions.resource.requestCollection('stacks'));

      if (['integrations', 'flows'].includes(resourceType)) {
        // redirect to integration Settings
        const integration = createdComponents.find(
          c => c.model === 'Integration'
        );

        if (integration) {
          props.history.push(
            getRoutePath(`/integrations/${integration._id}/settings/flows`)
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
