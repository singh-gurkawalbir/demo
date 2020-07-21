import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../../../../../actions';
import TradingPartnerIcon from '../../../../icons/RevokeTokenIcon';
import useConfirmDialog from '../../../../ConfirmDialog';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import * as selectors from '../../../../../reducers';

const connectionsFilterConfig = {
  type: 'connections',
  ignoreEnvironmentFilter: true,
};

export default {
  label: (rowData) => `Mark as ${rowData?.ftp?.tradingPartner ? 'not' : ''} trading partner`,
  icon: TradingPartnerIcon,
  component: function TradingPartner({ rowData = {}}) {
    const { _id: connectionId } = rowData;
    const dispatch = useDispatch();
    const [openDialog, setOpenDialog] = useState(false);
    const { confirmDialog } = useConfirmDialog();
    let connections = useSelectorMemo(
      selectors.makeResourceListSelector,
      connectionsFilterConfig
    ).resources;

    const currConnection = connections.find(c => (c._id === connectionId));

    connections = connections.filter(c => (c.type === 'ftp' &&
      c.ftp.hostURI === currConnection.ftp.hostURI &&
      c.ftp.port === currConnection.ftp.port &&
      c.sandbox === currConnection.sandbox
    ));
    let connectionNames = '';
    connections.forEach(c => {
      connectionNames += `<p> ${c.name} </p>`;
    });

    const updateTradingPartner = useCallback(() => {
      dispatch(
        actions.connection.updateTradingPartner(connectionId)
      );
    }, [connectionId, dispatch]);
    const confirmTradingPartner = useCallback(() => {
      confirmDialog({
        title: 'Confirm connection changes',
        isHtml: true,
        message: `Are you sure you want to mark the following connections as ${rowData?.ftp?.tradingPartner ? 'not' : ''} being trading partners? ${connectionNames}`,
        buttons: [
          {
            label: 'Confirm',
            onClick: () => {
              updateTradingPartner();
            }
          },
          {
            label: 'Cancel',
            color: 'secondary',
          }]
      });
    }, [confirmDialog, rowData?.ftp?.tradingPartner, updateTradingPartner, connectionNames]);

    useEffect(() => {
      if (!openDialog) {
        confirmTradingPartner();
        setOpenDialog(true);
      }
    }, [confirmTradingPartner, openDialog]);

    return null;
  },
};
