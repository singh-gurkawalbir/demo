import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import InstallWizard from '../../components/InstallationWizard';
import templateUtil from '../../utils/template';

export default function TemplateInstall(props) {
  const { templateId } = props.match.params;
  const dispatch = useDispatch();
  const template =
    useSelector(state => selectors.marketplaceTemplate(state, templateId)) ||
    {};
  const { runKey } =
    useSelector(state => selectors.templateSetup(state, templateId)) || {};
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
      const dependentResources =
        templateUtil.getDependentResources(createdComponents) || [];

      dependentResources.forEach(res => {
        dispatch(actions.resource.requestCollection(res));
      });

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
        runKey={runKey}
        installSteps={installSteps}
        resource={template}
        handleSetupComplete={handleSetupComplete}
      />
    </LoadResources>
  );
}
