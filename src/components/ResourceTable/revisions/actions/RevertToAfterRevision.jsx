import { nanoid } from 'nanoid';
import { useRouteMatch } from 'react-router-dom';
import RevertIcon from '../../../icons/ViewResolvedHistoryIcon';
import { DRAWER_URL_PREFIX } from '../../../../utils/drawerURLs';
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
      drawerURL: `${match.url}/${DRAWER_URL_PREFIX}/revert/${nanoid()}/open/toAfter/revision/${revisionId}`,
    });
  },
};
