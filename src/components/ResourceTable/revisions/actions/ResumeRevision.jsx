import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ResumeIcon from '../../../icons/RunIcon';
import { REVISION_TYPES } from '../../../../utils/constants';
import { DRAWER_URL_PREFIX } from '../../../../utils/drawerURLs';

export default {
  key: 'resumeRevision',
  useLabel: () => 'Resume operation',
  icon: ResumeIcon,
  useOnClick: rowData => {
    const { _id: revisionId, type } = rowData;
    const history = useHistory();
    const match = useRouteMatch();
    const handleClick = useCallback(() => {
      if (type === REVISION_TYPES.PULL) {
        history.push(`${match.url}/${DRAWER_URL_PREFIX}/pull/${revisionId}/merge`);
      }
      if (type === REVISION_TYPES.REVERT) {
        history.push(`${match.url}/${DRAWER_URL_PREFIX}/revert/${revisionId}/final`);
      }
    }, [revisionId, type, history, match.url]);

    return handleClick;
  },
};
