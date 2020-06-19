import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import CopyIcon from '../../../icons/CopyIcon';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';

export default {
  label: (rowData, actionProps) => `Clone ${actionProps && MODEL_PLURAL_TO_LABEL[actionProps.resourceType].toLowerCase()}`,
  icon: CopyIcon,
  component: function Clone({ resourceType, rowData = {} }) {
    const { _id: resourceId } = rowData;
    const history = useHistory();
    const openCloneURL = useCallback(() => {
      history.push((`/pg/clone/${resourceType}/${resourceId}/preview`));
    }, [history, resourceId, resourceType]);

    useEffect(() => {
      openCloneURL();
    }, [openCloneURL]);

    return null;
  },
};
