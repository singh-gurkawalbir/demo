import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { selectors } from '../../../reducers';
import CeligoPageBar from '../../../components/CeligoPageBar';
import AddIcon from '../../../components/icons/AddIcon';
import ZipDownIcon from '../../../components/icons/DownloadIntegrationIcon';
import ZipUpIcon from '../../../components/icons/InstallIntegrationIcon';
import IconTextButton from '../../../components/IconTextButton';
import { generateNewId } from '../../../utils/resource';

export default function IntegrationCeligoPageBar() {
  const location = useLocation();

  const permission = useSelector(state => {
    const {create, install} = selectors.resourcePermissions(state, 'integrations');

    return {create, install};
  }, shallowEqual);

  return (
    <CeligoPageBar title="My integrations">
      {permission.create && (
        <IconTextButton
          data-test="newIntegration"
          component={Link}
          to={`${location.pathname}/add/integrations/${generateNewId()}`}
          variant="text"
          color="primary">
          <AddIcon />
          Create integration
        </IconTextButton>
      )}
      {permission.install && (
        <IconTextButton
          data-test="installZip"
          component={Link}
          to={`${location.pathname}/installIntegration`}
          variant="text"
          color="primary">
          <ZipUpIcon />
          Install integration
        </IconTextButton>
      )}
      {/* TODO: What condition to use for download Integration */}
      {permission.create && (
        <IconTextButton
          data-test="downloadIntegration"
          component={Link}
          to={`${location.pathname}/downloadIntegration`}
          variant="text"
          color="primary">
          <ZipDownIcon />
          Download integration
        </IconTextButton>
      )}
    </CeligoPageBar>
  );
}
