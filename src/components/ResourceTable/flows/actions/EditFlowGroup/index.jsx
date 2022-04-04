import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import EditIcon from '../../../../icons/EditIcon';
import { UNASSIGNED_SECTION_ID } from '../../../../../utils/constants';
import { drawerPaths, buildDrawerUrl } from '../../../../../utils/rightDrawer';

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
      history.push(buildDrawerUrl({ path: drawerPaths.FLOW_GROUP.EDIT, baseUrl: match.url }));
    }, [history, match.url]);

    return openEditFlowGroup;
  },
};
