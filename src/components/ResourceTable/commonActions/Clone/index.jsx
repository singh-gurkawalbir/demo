import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import CopyIcon from '../../../icons/CopyIcon';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';
import getRoutePath from '../../../../utils/routePaths';

export default {
  label: (rowData, actionProps) => `Clone ${MODEL_PLURAL_TO_LABEL[actionProps?.resourceType]?.toLowerCase()}`,
  icon: CopyIcon,
  hasAccess: ({ state, rowData, resourceType }) => {
    const { _integrationId } = rowData;

    // only check permissions for integration flows as only those can be shared
    if (resourceType !== 'flows' || !_integrationId) { return true; }

    const canClone = selectors.resourcePermissions(
      state,
      'integrations',
      _integrationId,
      'flows'
    ).clone;

    return canClone;
  },
  component: function Clone({ resourceType, rowData = {} }) {
    const { _id: resourceId } = rowData;
    const history = useHistory();
    const openCloneURL = useCallback(() => {
      history.push(getRoutePath(`/clone/${resourceType}/${resourceId}/preview`));
    }, [history, resourceId, resourceType]);

    useEffect(() => {
      openCloneURL();
    }, [openCloneURL]);

    return null;
  },
};
