import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../../actions';
import TradingPartnerIcon from '../../../../icons/RevokeTokenIcon';
import useConfirmDialog from '../../../../ConfirmDialog';
import { selectors } from '../../../../../reducers';
import { COMM_STATES } from '../../../../../reducers/comms/networkComms';

export default {
  label: rowData => `Mark as ${rowData?.ftp?.tradingPartner ? 'not' : ''} trading partner`,
  icon: TradingPartnerIcon,
  component: function TradingPartner({ rowData = {}}) {
    const { _id: connectionId } = rowData;
    const dispatch = useDispatch();
    const [openDialog, setOpenDialog] = useState(false);
    const [tradingPartnerConnectionsRequested, setTradingPartnerConnectionsRequested] = useState(false);
    const { confirmDialog } = useConfirmDialog();
    const { connections = [], status } = useSelector(state =>
      selectors.tradingPartnerConnections(state, connectionId)
    );
    let connectionsList = '';

    connections.forEach(c => {
      connectionsList += `<p> ${c.name} </p>`;
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
        message: `Are you sure you want to mark the following connections as ${rowData?.ftp?.tradingPartner ? 'not' : ''} being trading partners? ${connectionsList}`,
        buttons: [
          {
            label: 'Confirm',
            onClick: () => {
              updateTradingPartner();
            },
          },
          {
            label: 'Cancel',
            color: 'secondary',
          }],
      });
    }, [confirmDialog, rowData?.ftp?.tradingPartner, updateTradingPartner, connectionsList]);

    useEffect(() => {
      if (!tradingPartnerConnectionsRequested) {
        dispatch(actions.resource.connections.requestTradingPartnerConnections(connectionId));
        setTradingPartnerConnectionsRequested(true);
      }
      if (status === COMM_STATES.SUCCESS && !openDialog) {
        confirmTradingPartner();
        setOpenDialog(true);
      }
    }, [confirmTradingPartner, openDialog, dispatch, connectionId, status, tradingPartnerConnectionsRequested]);

    return null;
  },
};
