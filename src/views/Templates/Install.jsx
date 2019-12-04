import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import InstallWizard from '../../components/InstallationWizard';

export default function TemplateInstall(props) {
  const { templateId } = props.match.params;
  const history = useHistory();
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
    redirectTo => {
      history.push(redirectTo);
      dispatch(actions.template.clearTemplate(templateId));
    },
    [dispatch, history, templateId]
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
