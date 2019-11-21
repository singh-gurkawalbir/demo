import { useSelector, useDispatch } from 'react-redux';
import { IconButton } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import Icon from '../../../../icons/DownloadIcon';
// import openExternalUrl from '../../../../../utils/window';
import actions from '../../../../../actions';

export default {
  label: 'Download debug logs',
  component: function DownloadDebugLogs({ resource }) {
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

      // openExternalUrl({ url });
      dispatch(actions.connection.requestDebugLogs(url));
    };

    return (
      <IconButton
        data-test="downloadDebugLog"
        size="small"
        onClick={onDownloadDebugLogClick}>
        <Icon />
      </IconButton>
    );
  },
};
