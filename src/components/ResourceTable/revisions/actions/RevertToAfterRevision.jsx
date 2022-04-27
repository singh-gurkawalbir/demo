import { nanoid } from 'nanoid';
import { useRouteMatch } from 'react-router-dom';
import RevertIcon from '../../../icons/ViewResolvedHistoryIcon';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';
import useOpenRevisionWhenValid from '../../../drawer/Revisions/hooks/useOpenRevisionWhenValid';

export default {
  key: 'revertToAfterRevision',
  useLabel: () => 'Revert to after this revision',
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
          tempRevId: nanoid(),
          revertTo: 'toAfter',
          revisionId,
        },
      }),
    });
  },
};
