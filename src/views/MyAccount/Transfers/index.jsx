import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { selectors } from '../../../reducers';
import LoadResources from '../../../components/LoadResources';
import ResourceTable from '../../../components/ResourceTable';
import Invite from './Invite';
import AddIcon from '../../../components/icons/AddIcon';
import PanelHeader from '../../../components/PanelHeader';
import { TextButton } from '../../../components/Buttons';
import infoText from '../../../components/Help/infoText';
import { message } from '../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'auto',
    minHeight: 124,
  },
  heading: {
    paddingLeft: theme.spacing(1),
  },
  transferTableWrapper: {
    overflowX: 'auto',
  },
  description: {
    padding: theme.spacing(2),
  },
}));

export default function Transfers() {
  const classes = useStyles();
  const transfers = useSelector(
    state =>
      selectors.transferListWithMetadata(state, { type: 'transfers' })
  );

  const [showInviteView, setShowInviteView] = useState(false);
  const handleNewTransferClick = () => {
    setShowInviteView(true);
  };

  return (
    <>
      <LoadResources resources="transfers,integrations">
        {!showInviteView && (
          <>
            <div className={classes.root}>
              <PanelHeader title="Transfers" infoText={infoText.Transfers}>
                <TextButton
                  data-test="newTransfer"
                  startIcon={<AddIcon />}
                  onClick={handleNewTransferClick}>
                  Create transfer
                </TextButton>
              </PanelHeader>

              <ResourceTable
                resourceType="transfers"
                resources={transfers}
                className={classes.transferTableWrapper}
            />
            </div>
            <div className={classes.description}>
              {message.TRANSFERS.TRANSFER_INTEGRATIONS}
            </div>
          </>
        )}
        {showInviteView && <Invite setShowInviteView={setShowInviteView} />}
      </LoadResources>
    </>
  );
}

