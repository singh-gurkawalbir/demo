import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../../reducers';
import DownloadIcon from '../../../../icons/DownloadIcon';
import openExternalUrl from '../../../../../utils/window';
import IconButtonWithTooltip from '../../../../IconButtonWithTooltip';

export default {
  component: function DownloadDebugLogs({ resource }) {
    const { _id: connectionId } = resource;
    const url = `/connections/${connectionId}/debug`;
    const additionalHeaders = useSelector(state =>
      selectors.accountShareHeader(state, url)
    );
    const handleDownloadDebugLogsClick = useCallback(() => {
      let _url = url;

      if (additionalHeaders && additionalHeaders['integrator-ashareid']) {
        _url += `?integrator-ashareid=${
          additionalHeaders['integrator-ashareid']
        }`;
      }

      _url = `/api${url}`;
      openExternalUrl({ url: _url });
    }, [additionalHeaders, url]);

    return (
      <IconButtonWithTooltip
        tooltipProps={{
          title: 'Download debug logs',
        }}
        data-test="downloadDebugLog"
        size="small"
        onClick={handleDownloadDebugLogsClick}>
        <DownloadIcon />
      </IconButtonWithTooltip>
    );
  },
};
