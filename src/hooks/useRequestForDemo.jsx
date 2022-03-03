import { makeStyles } from '@material-ui/core';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../actions';
import ModalDialog from '../components/ModalDialog';
import { CONTACT_SALES_MESSAGE } from '../utils/messageStore';

const useStyles = makeStyles(theme => ({
  link: {
    paddingLeft: theme.spacing(1),
  },
}));

const ModalWrapper = ({setShowMessage}) => {
  const classes = useStyles();

  return (
    <ModalDialog show onClose={() => setShowMessage(false)}>
      <div>Thank you! Your request has been received.</div>
      <div>
        {CONTACT_SALES_MESSAGE}
        <a
          href="http://www.celigo.com/integration-marketplace"
          rel="noopener noreferrer"
          target="_blank"
          className={classes.link}>
          http://www.celigo.com/integration-marketplace
        </a>
      </div>
    </ModalDialog>
  );
};
export default function useRequestForDemo() {
  const dispatch = useDispatch();
  const [showMessage, setShowMessage] = useState(false);

  const requestDemo = useCallback(connector => {
    dispatch(actions.marketplace.contactSales(connector.name, connector._id));
    setShowMessage(true);
  }, [dispatch]);
  const RequestDemoDialog = useMemo(() => () => showMessage ? (
    <ModalWrapper setShowMessage={setShowMessage} />
  )
    : null, [showMessage]);

  return {RequestDemoDialog, requestDemo };
}
