import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { selectors } from '../../../reducers';
import CeligoPageBar from '../../../components/CeligoPageBar';
import AddIcon from '../../../components/icons/AddIcon';
import ZipDownIcon from '../../../components/icons/DownloadIntegrationIcon';
import ZipUpIcon from '../../../components/icons/InstallIntegrationIcon';
import { generateNewId } from '../../../utils/resource';
import TextButton from '../../../components/Buttons/TextButton';
import ActionGroup from '../../../components/ActionGroup';

export default function IntegrationCeligoPageBar() {
  const location = useLocation();

  const permission = useSelector(state => {
    const {create, install} = selectors.resourcePermissions(state, 'integrations');

    return {create, install};
  }, shallowEqual);

  return (
    <CeligoPageBar title="My integrations">
      <ActionGroup>
        {permission.create && (
        <TextButton
          data-test="newIntegration"
          component={Link}
          startIcon={<AddIcon />}
          to={`${location.pathname}/add/integrations/${generateNewId()}`}
          >
          Create integration
        </TextButton>
        )}
        {permission.install && (
        <TextButton
          data-test="installZip"
          component={Link}
          startIcon={<ZipUpIcon />}
          to={`${location.pathname}/installIntegration`}
          >
          Install integration
        </TextButton>
        )}
        {/* TODO: What condition to use for download Integration */}
        {permission.create && (
        <TextButton
          data-test="downloadIntegration"
          component={Link}
          startIcon={<ZipDownIcon />}
          to={`${location.pathname}/downloadIntegration`}
          >
          Download integration
        </TextButton>
        )}
      </ActionGroup>
    </CeligoPageBar>
  );
}
