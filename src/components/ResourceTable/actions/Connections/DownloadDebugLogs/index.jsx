import { useCallback, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import * as selectors from '../../../../../reducers';
import openExternalUrl from '../../../../../utils/window';
import DownloadIcon from '../../../../icons/DownloadIcon';

export default {
  label: 'Download debug logs',
  icon: DownloadIcon,
  component: function DownloadDebugLogs({ rowData = {} }) {
    const { _id: connectionId } = rowData;
    const url = `/connections/${connectionId}/debug`;
    const additionalHeaders = useSelector(
      state => selectors.accountShareHeader(state, url),
      shallowEqual
    );
    const downloadDebugLogs = useCallback(() => {
      let _url = `/api${url}`;

      if (additionalHeaders && additionalHeaders['integrator-ashareid']) {
        _url += `?integrator-ashareid=${
          additionalHeaders['integrator-ashareid']
        }`;
      }

      openExternalUrl({ url: _url });
    }, [additionalHeaders, url]);

    useEffect(() => {
      downloadDebugLogs();
    }, [downloadDebugLogs]);

    return null;
  },
};
