import { useSelector, shallowEqual } from 'react-redux';
import { IconButton } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import DownloadIcon from '../../../../icons/DownloadIcon';
import openExternalUrl from '../../../../../utils/window';

export default {
  label: 'Download debug logs',
  component: function DownloadDebugLogs({ resource }) {
    const { _id: connectionId } = resource;
    let url = `/connections/${connectionId}/debug`;
    const additionalHeaders = useSelector(state =>
      selectors.accountShareHeader(state, url)
    );
    const canAccess = useSelector(
      state =>
        selectors.resourcePermissions(state, 'connections', connectionId).edit,
      shallowEqual
    );

    if (!canAccess) return null;
    const handleDownloadDebugLogsClick = () => {
      if (additionalHeaders && additionalHeaders['integrator-ashareid']) {
        url += `?integrator-ashareid=${
          additionalHeaders['integrator-ashareid']
        }`;
      }

      url = `/api${url}`;
      openExternalUrl({ url });
    };

    return (
      <IconButton
        data-test="downloadDebugLog"
        size="small"
        onClick={handleDownloadDebugLogsClick}>
        <DownloadIcon />
      </IconButton>
    );
  },
};
