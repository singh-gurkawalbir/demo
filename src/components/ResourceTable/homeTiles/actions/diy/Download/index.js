import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DownloadIcon from '../../../../../icons/DownloadIcon';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';

export default {
  key: 'generateTemplateZip',
  useLabel: () => 'Download integration',
  icon: DownloadIcon,
  useHasAccess: () => {
    const canDownload = useSelector(state => selectors.resourcePermissions(state, 'integrations')?.create);

    return canDownload;
  },
  useOnClick: ({_integrationId}) => {
    const dispatch = useDispatch();
    const handleDownload = useCallback(() => {
      dispatch(actions.template.generateZip(_integrationId));
    }, [_integrationId, dispatch]);

    return handleDownload;
  },
};
