import { useRouteMatch } from 'react-router-dom';
import { generateId } from '../../../../utils/string';
import RevertIcon from '../../../icons/ViewResolvedHistoryIcon';
import useOpenRevisionWhenValid from '../../../drawer/Revisions/hooks/useOpenRevisionWhenValid';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';

export default {
  key: 'revertToBefore',
  useLabel: () => 'Revert to before this revision',
  icon: RevertIcon,
  useOnClick: rowData => {
    const { _id: revisionId } = rowData;
    const match = useRouteMatch();
    const { integrationId } = match.params;

    return useOpenRevisionWhenValid({
      integrationId,
      drawerURL: buildDrawerUrl({
        path: drawerPaths.LCM.OPEN_REVERT,
        baseUrl: match.url,
        params: {
          tempRevId: generateId(),
          revertTo: 'toBefore',
          revisionId,
        },
      }),
    });
  },
};
