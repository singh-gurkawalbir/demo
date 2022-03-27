import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import EditIcon from '../../../../icons/EditIcon';
import getRoutePath from '../../../../../utils/routePaths';
import { UNASSIGNED_SECTION_ID } from '../../../../../utils/constants';
import { DRAWER_URL_PREFIX } from '../../../../../utils/drawerURLs';

export default {
  key: 'editFlowGroup',
  useLabel: () => 'Edit flow group',
  icon: EditIcon,
  useDisabledActionText: rowData => {
    if (rowData.sectionId === UNASSIGNED_SECTION_ID) {
      return 'Unassigned cannot be edited';
    }
  },
  useOnClick: () => {
    const history = useHistory();
    const match = useRouteMatch();
    const openEditFlowGroup = useCallback(() => {
      history.push(getRoutePath(`${match.url}/${DRAWER_URL_PREFIX}/flowgroups/edit`));
    }, [history, match.url]);

    return openEditFlowGroup;
  },
};
