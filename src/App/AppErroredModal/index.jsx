import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import ModalDialog from '../../components/ModalDialog';
import * as selectors from '../../reducers';
import actions from '../../actions';

export default function AppErroredModal() {
  const appErrored = useSelector(state => selectors.appErrored(state));
  const dispatch = useDispatch();

  return appErrored ? (
    <ModalDialog show>
      <Fragment>
        <span>Application Errored</span>
      </Fragment>
      <Typography>
        Oops...Something has caused the Integrator to crash. <br />
        To resume working with Integrator please the click the reload button .
      </Typography>
      <Button
        onClick={() => {
          dispatch(actions.clearAppError());
          window.location.reload();
        }}>
        Reload
      </Button>
    </ModalDialog>
  ) : null;
}
