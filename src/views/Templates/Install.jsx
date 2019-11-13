import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import InstallWizard from '../../components/InstallationWizard';

export default function TemplateInstall(props) {
  const { templateId } = props.match.params;
  const dispatch = useDispatch();
  const template =
    useSelector(state => selectors.marketplaceTemplate(state, templateId)) ||
    {};
  const installSteps = useSelector(state =>
    selectors.templateInstallSteps(state, templateId)
  );
  const handleSetupComplete = useCallback(
    createdComponents => {
      // redirect to integration Settings
      const integration = createdComponents.find(
        c => c.model === 'Integration'
      );

      dispatch(actions.template.clearTemplate(templateId));
      dispatch(actions.resource.requestCollection('integrations'));
      dispatch(actions.resource.requestCollection('flows'));
      dispatch(actions.resource.requestCollection('connections'));
      dispatch(actions.resource.requestCollection('exports'));
      dispatch(actions.resource.requestCollection('imports'));
      dispatch(actions.resource.requestCollection('stacks'));

      if (integration) {
        props.history.push(`/pg/integrations/${integration._id}/flows`);
      } else {
        props.history.push('/');
      }
    },
    [dispatch, props.history, templateId]
  );

  return (
    <LoadResources required resources="connections,integrations">
      <InstallWizard
        {...props}
        templateId={templateId}
        type="template"
        installSteps={installSteps}
        resource={template}
        handleSetupComplete={handleSetupComplete}
      />
    </LoadResources>
  );
}
