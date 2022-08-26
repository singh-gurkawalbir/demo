import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import ResumeIcon from '../../../icons/RunIcon';
import { REVISION_TYPES } from '../../../../constants';
import { buildDrawerUrl, drawerPaths } from '../../../../utils/rightDrawer';

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
        history.push(buildDrawerUrl({
          path: drawerPaths.LCM.MERGE_PULL_CHANGES,
          baseUrl: match.url,
          params: { revisionId },
        }));
      }
      if (type === REVISION_TYPES.REVERT) {
        history.push(buildDrawerUrl({
          path: drawerPaths.LCM.FINAL_REVERT_STEP,
          baseUrl: match.url,
          params: { revisionId },
        }));
      }
    }, [revisionId, type, history, match.url]);

    return handleClick;
  },
};
