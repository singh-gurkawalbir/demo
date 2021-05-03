import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../reducers';
import CopyIcon from '../../../icons/CopyIcon';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';
import getRoutePath from '../../../../utils/routePaths';
import { useGetTableContext } from '../../../CeligoTable/TableContext';

export default {
  useLabel: () => {
    const tableContext = useGetTableContext();

    return `Clone ${MODEL_PLURAL_TO_LABEL[tableContext?.resourceType]?.toLowerCase()}`;
  },
  icon: CopyIcon,
  useHasAccess: rowData => {
    const {resourceType} = useGetTableContext();

    const { _integrationId } = rowData;
    const canClone = useSelector(state => selectors.resourcePermissions(
      state,
      'integrations',
      _integrationId,
      'flows'
    ))?.clone;

    // only check permissions for integration flows as only those can be shared
    if (resourceType !== 'flows' || !_integrationId) { return true; }

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
