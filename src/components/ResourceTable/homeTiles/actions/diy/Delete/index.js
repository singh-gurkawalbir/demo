import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import TrashIcon from '../../../../../icons/TrashIcon';
import { selectors } from '../../../../../../reducers';
import useHandleDelete from '../../../../../../views/Integration/hooks/useHandleDelete';

export default {
  key: 'deleteIntegration',
  useLabel: () => 'Delete integration',
  mode: 'delete',
  icon: TrashIcon,
  useHasAccess: tile => {
    const canDelete = useSelector(state => selectors.resourcePermissionsForTile(
      state,
      'integrations',
      tile._integrationId,
      tile
    )?.delete);

    return canDelete;
  },
  Component: ({rowData}) => {
    const {_integrationId, _connectorId, supportsMultiStore, name, mode} = rowData;

    const handleDelete = useHandleDelete(_integrationId, {_connectorId, supportsMultiStore, name, mode});

    useEffect(() => {
      handleDelete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
  },
};
