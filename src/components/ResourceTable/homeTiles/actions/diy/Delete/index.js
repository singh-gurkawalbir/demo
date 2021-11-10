import { useSelector } from 'react-redux';
import TrashIcon from '../../../../../icons/TrashIcon';
import { selectors } from '../../../../../../reducers';
import useHandleDelete from '../../../../../../views/Integration/hooks/useHandleDelete';

export default {
  key: 'deleteIntegration',
  useLabel: () => 'Delete integration',
  icon: TrashIcon,
  useHasAccess: ({_integrationId}) => {
    const canDelete = useSelector(state => selectors.resourcePermissions(
      state,
      'integrations',
      _integrationId
    )?.delete);

    return canDelete;
  },
  useOnClick: ({_integrationId}) => useHandleDelete(_integrationId),
};
