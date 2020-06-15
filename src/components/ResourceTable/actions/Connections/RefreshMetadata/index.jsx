import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import RefreshIcon from '../../../../icons/RefreshIcon';
import * as selectors from '../../../../../reducers';
import useEnqueueSnackbar from '../../../../../hooks/enqueueSnackbar';

export default {
  label: 'Refresh metadata',
  icon: RefreshIcon,
  component: function RefreshMetadata({ rowData = {} }) {
    const { type: resourceType, _id: resourceId } = rowData;
    const dispatch = useDispatch();
    const refreshMetadata = useCallback(() => {
      if (resourceType === 'netsuite') {
        dispatch(
          actions.metadata.request(
            resourceId,
            `netsuite/metadata/suitescript/connections/${resourceId}/recordTypes`,
            {
              refreshCache: true,
            }
          )
        );
        dispatch(
          actions.metadata.request(
            resourceId,
            `netsuite/metadata/suitescript/connections/${resourceId}/savedSearches`,
            {
              refreshCache: true,
            }
          )
        );

        dispatch(
          actions.metadata.request(
            resourceId,
            `netsuite/metadata/webservices/connections/${resourceId}/recordTypes?recordTypeOnly=true`,
            {
              refreshCache: true,
            }
          )
        );
      } else if (resourceType === 'salesforce') {
        dispatch(
          actions.metadata.request(
            resourceId,
            `salesforce/metadata/connections/${resourceId}/sObjectTypes`,
            {
              refreshCache: true,
            }
          )
        );
      }
    }, [dispatch, resourceId, resourceType]);
    const isConnectionOffline = useSelector(state =>
      selectors.isConnectionOffline(state, resourceId)
    );
    const [enqueueSnackbar] = useEnqueueSnackbar();

    useEffect(() => {
      if (!isConnectionOffline) refreshMetadata();
      else {
        enqueueSnackbar({
          message: 'Connection is offline',
          variant: 'error',
        });
      }
    }, [enqueueSnackbar, isConnectionOffline, refreshMetadata]);

    return null;
  },
};
