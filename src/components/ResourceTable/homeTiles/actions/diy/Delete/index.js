import { useSelector } from 'react-redux';
import React, { useEffect } from 'react';
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
  Component: ({rowData}) => {
    const {_integrationId} = rowData;
    const handleDelete = useHandleDelete(_integrationId);

    useEffect(() => {
      handleDelete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (<></>);
  },
};
