import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import DownloadIcon from '../../../../icons/DownloadIcon';
import DebugIcon from '../../../../icons/DebugIcon';
import openExternalUrl from '../../../../../utils/window';
import actions from '../../../../../actions';

export default {
  label: (r, actionProps) =>
    actionProps.type === 'flowBuilder'
      ? 'Open debugger'
      : 'Download debug logs',
  component: function DownloadDebugLogs({ resource, type }) {
    const dispatch = useDispatch();
    let url = `/connections/${resource._id}/debug`;
    const additionalHeaders = useSelector(state =>
      selectors.accountShareHeader(state, url)
    );
    const onDownloadDebugLogClick = () => {
      if (additionalHeaders && additionalHeaders['integrator-ashareid']) {
        url += `?integrator-ashareid=${
          additionalHeaders['integrator-ashareid']
        }`;
      }

      if (type === 'flowBuilder') {
        dispatch(actions.connection.requestDebugLogs(url, resource._id));
      } else {
        url = `/api${url}`;
        openExternalUrl({ url });
      }
    };

    return (
      <IconButton
        data-test="downloadDebugLog"
        size="small"
        onClick={onDownloadDebugLogClick}>
        {type === 'flowBuilder' ? <DebugIcon /> : <DownloadIcon />}
      </IconButton>
    );
  },
};
