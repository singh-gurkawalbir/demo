import { nanoid } from 'nanoid';
import { useRouteMatch } from 'react-router-dom';
import RevertIcon from '../../../icons/ViewResolvedHistoryIcon';
import useOpenRevisionWhenValid from '../../../drawer/Revisions/hooks/useOpenRevisionWhenValid';

export default {
  key: 'revertToRevision',
  useLabel: () => 'Revert to this revision',
  icon: RevertIcon,
  useOnClick: rowData => {
    const { _id: revisionId } = rowData;
    const match = useRouteMatch();
    const { integrationId } = match.params;

    return useOpenRevisionWhenValid({
      integrationId,
      drawerURL: `${match.url}/revert/${nanoid()}/open/toBefore/revision/${revisionId}`,
    });
  },
};
