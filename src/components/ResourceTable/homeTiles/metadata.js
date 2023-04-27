import React from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import { TimeAgo } from '@celigo/fuse-ui';
import NameCell from './cells/NameCell';
import StatusCell from './cells/StatusCell';
import TypeCell from './cells/TypeCell';
import MultiSelectColumnFilter from '../commonCells/MultiSelectColumnFilter';
import {FILTER_KEY, getAllApplications} from '../../../utils/home';
import { STANDALONE_INTEGRATION, TILE_STATUS } from '../../../constants';
import DIYClone from './actions/diy/Clone';
import DIYDelete from './actions/diy/Delete';
import DIYDownload from './actions/diy/Download';
import IAClone from './actions/integrationApp/Clone';
import IAUninstall from './actions/integrationApp/Uninstall';
import IARenew from './actions/integrationApp/Renew';
import IAReactivate from './actions/integrationApp/Reactivate';
import PinAction from './actions/common/Pin';
import UnpinAction from './actions/common/Unpin';
import LogoStrip from '../../LogoStrip';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { selectors } from '../../../reducers';

const useStyles = makeStyles(theme => ({
  appsNotAvailable: {
    color: theme.palette.secondary.light,
    fontSize: '13px',
  },
}));

export default {
  useColumns: () => {
    const isUserInErrMgtTwoDotZero = useSelector(state =>
      selectors.isOwnerUserInErrMgtTwoDotZero(state)
    );
    const columns = [
      {
        key: 'name',
        heading: 'Name',
        orderBy: 'name',
        isLoggable: true,
        Value: ({rowData: r}) => (
          <NameCell tile={r} />
        ),
      },
      {
        key: 'applications',
        HeaderValue: () => (
          <MultiSelectColumnFilter
            title="Applications"
            filterBy="applications"
            filterKey={FILTER_KEY}
            options={getAllApplications()}
            />
        ),
        isLoggable: true,
        Value: ({rowData: r}) => {
          const classes = useStyles();
          const applications = useSelectorMemo(selectors.mkTileApplications, r);

          if (r._integrationId === STANDALONE_INTEGRATION.id || r.ssLinkedConnectionId) {
            return (
              <Typography component="span" className={classes.appsNotAvailable}>
                N/A
              </Typography>
            );
          }

          return (
            <LogoStrip applications={applications} />
          );
        },
      },
      {
        key: 'status',
        orderBy: 'status',
        heading: 'Status',
        isLoggable: true,
        Value: ({rowData: r}) => (
          <StatusCell tile={r} />
        ),
      },
    ];

    if (isUserInErrMgtTwoDotZero) {
      columns.push({
        key: 'lastErrorAt',
        orderBy: 'lastErrorAt',
        heading: 'Last open error',
        isLoggable: true,
        Value: ({rowData: r}) => <TimeAgo date={r.lastErrorAt} />,
      });
    }

    columns.push({
      key: 'type',
      heading: 'Type',
      orderBy: 'sortablePropType',
      isLoggable: true,
      Value: ({rowData: r}) => (
        <TypeCell tile={r} />
      ),
    });

    return columns;
  },
  useRowActions: ({_connectorId, ssLinkedConnectionId, _integrationId, pinned, status }) => {
    if (_integrationId === STANDALONE_INTEGRATION.id) return [];
    const pinUnpin = pinned ? UnpinAction : PinAction;

    if (ssLinkedConnectionId) return [pinUnpin];
    // clone and download actions are not valid for tiles with pending config
    const isConfigPending = status === TILE_STATUS.IS_PENDING_SETUP || status === TILE_STATUS.UNINSTALL;

    if (_connectorId) {
      if (isConfigPending) return [IARenew, IAReactivate, pinUnpin, IAUninstall];

      return [IARenew, IAReactivate, pinUnpin, IAClone, IAUninstall];
    }
    if (isConfigPending) return [pinUnpin, DIYDelete];

    return [pinUnpin, DIYClone, DIYDownload, DIYDelete];
  },
};
