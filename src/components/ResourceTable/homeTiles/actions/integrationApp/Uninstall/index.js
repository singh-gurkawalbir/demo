import { useSelector } from 'react-redux';
import TrashIcon from '../../../../../icons/TrashIcon';
import { selectors } from '../../../../../../reducers';
import useHandleDelete from '../../../../../../views/Integration/hooks/useHandleDelete';

export default {
  key: 'uninstallConnector',
  useLabel: () => 'Uninstall integration',
  icon: TrashIcon,
  useHasAccess: rowData => {
    const {_integrationId} = rowData;

    const canUninstall = useSelector(state => !selectors.isFormAMonitorLevelAccess(state, _integrationId));

    return canUninstall;
  },
  useOnClick: ({_integrationId}) => useHandleDelete(_integrationId),

};
