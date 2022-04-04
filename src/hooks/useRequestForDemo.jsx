import { makeStyles } from '@material-ui/core';
import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import actions from '../actions';
import ModalDialog from '../components/ModalDialog';
import messageStore from '../utils/messageStore';
import { FilledButton } from '../components/Buttons';

const useStyles = makeStyles(theme => ({
  link: {
    paddingLeft: theme.spacing(1),
  },
}));

const ModalWrapper = ({setShowMessage}) => {
  const classes = useStyles();

  return (
    <ModalDialog show onClose={() => setShowMessage(false)}>
      <div>Thanks for your request !</div>
      <div>
        {messageStore('CONTACT_SALES_MESSAGE')}
        <a
          href="http://www.celigo.com/integration-marketplace"
          rel="noopener noreferrer"
          target="_blank"
          className={classes.link}>
          check out our Marketplace.
        </a>
      </div>
      <FilledButton data-test="requestForDemo" onClick={() => setShowMessage(false)}>
        Close
      </FilledButton>
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
