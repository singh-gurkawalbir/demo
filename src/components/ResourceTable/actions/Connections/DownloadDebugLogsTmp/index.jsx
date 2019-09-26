import { useSelector } from 'react-redux';
import { IconButton } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import Icon from '../../../../icons/DownloadIcon';
import openExternalUrl from '../../../../../utils/window';

export default {
  label: 'Download debug logs',
  component: function DownloadDebugLogsTmp({ resource }) {
    let url = `/api/connections/${resource._id}/debug`;
    const additionalHeaders = useSelector(state =>
      selectors.accountShareHeader(state, url)
    );
    const onDownloadDebugLogClick = () => {
      if (additionalHeaders && additionalHeaders['integrator-ashareid']) {
        url += `?integrator-ashareid=${
          additionalHeaders['integrator-ashareid']
        }`;
      }

      openExternalUrl({ url });
    };

    return (
      <IconButton size="small" onClick={onDownloadDebugLogClick}>
        <Icon />
      </IconButton>
    );
  },
};
