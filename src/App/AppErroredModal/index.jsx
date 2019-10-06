import { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Typography, Button } from '@material-ui/core';
import ModalDialog from '../../components/ModalDialog';
import * as selectors from '../../reducers';
import actions from '../../actions';

function AppErroredModal({ history }) {
  const appErrored = useSelector(state => selectors.appErrored(state));
  const dispatch = useDispatch();

  return appErrored ? (
    <ModalDialog show>
      <Fragment>
        <span>Application Errored</span>
      </Fragment>
      <Typography>
        Oops! Something caused our app to crash. <br />
        To resume working, please reload.
      </Typography>
      <Button
        data-test="reload"
        variant="contained"
        color="primary"
        onClick={() => {
          dispatch(actions.app.clearError());
          history.replace('/pg');
          window.location.reload();
        }}>
        Reload
      </Button>
    </ModalDialog>
  ) : null;
}

export default withRouter(AppErroredModal);
