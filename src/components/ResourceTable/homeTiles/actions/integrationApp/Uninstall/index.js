import { useSelector } from 'react-redux';
import TrashIcon from '../../../../../icons/TrashIcon';
import { selectors } from '../../../../../../reducers';
import useHandleDelete from '../../../../../../views/Integration/hooks/useHandleDelete';

export default {
  key: 'uninstallConnector',
  useLabel: () => 'Uninstall integration',
  icon: TrashIcon,
  mode: 'delete',
  useHasAccess: ({_integrationId}) => {
    const canUninstall = useSelector(state => !selectors.isFormAMonitorLevelAccess(state, _integrationId));

    return canUninstall;
  },
  useOnClick: ({_integrationId, _connectorId, supportsMultiStore, name, mode}) => useHandleDelete(_integrationId, {_connectorId, supportsMultiStore, name, mode}),

};
