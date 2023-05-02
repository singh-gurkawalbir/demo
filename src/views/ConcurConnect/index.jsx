import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Spinner } from '@celigo/fuse-ui';
import getImageUrl from '../../utils/image';
import { FilledButton } from '../../components/Buttons';
import actions from '../../actions';
import { selectors } from '../../reducers';
import Loader from '../../components/Loader';
import useQuery from '../../hooks/useQuery';
import messageStore from '../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 770,
    margin: '0 auto',
    position: 'relative',
  },
  box: {
    width: '100%',
    border: '0px none',
    height: '799px',
    padding: theme.spacing(0, 2.5),
    textAlign: 'center',
    overflow: 'auto',
    position: 'relative',
    zIndex: 1,
  },
  innerbox: {
    width: '2500px',
    display: 'table-cell',
    height: '799px',
    verticalAlign: 'middle',
    padding: theme.spacing(1.25, 0),
  },
  logo: {
    margin: theme.spacing(0, 0, 5, 0),
    '& > img': {
      height: '50px',
      width: 'auto',
    },
  },
  text: {
    margin: '0 auto 15px auto',
  },
  close: {
    minWidth: 240,
    margin: theme.spacing(0, 0, 2, 0),
  },

}));

function ConcurConnectError({ message }) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.logo}>
        <img src={getImageUrl('/images/celigo-sapconcur.png')} alt="" />
      </div>
      <Typography className={classes.text} color="error">{message}</Typography>
      <div className="form-action" align="center">
        <FilledButton
          color="primary"
          className={classes.close}
          disabled={false}
          error={false}
          onClick={() => { window.close(); }}
          size="large"
            >
          Close
        </FilledButton>
      </div>
    </>
  );
}

function ConcurConnectSuccess({module}) {
  const classes = useStyles();
  let displayMessage;
  const history = useHistory();

  if (module === 'expense') {
    displayMessage = messageStore('SEND_SAP_CONCUR_MODULE', {module: 'expense reports'});
  } else if (module === 'invoice') {
    displayMessage = messageStore('SEND_SAP_CONCUR_MODULE', {module: 'invoices'});
  }

  return (
    <>
      <div className={classes.logo}>
        <img src={getImageUrl('/images/celigo-sapconcur-2.png')} alt="" />
      </div>
      <Typography className={classes.text} variant="body1">Congratulations - you&apos;re linked!</Typography>
      {displayMessage && <Typography className={classes.text} variant="body1">{displayMessage}</Typography>}

      <div className="form-action" align="center">
        <FilledButton
          color="primary"
          className={classes.close}
          disabled={false}
          error={false}
          onClick={() => { history.push(`/marketplace/concur${module}`); }}
          size="large"
        >
          Start integrating
        </FilledButton>
      </div>
    </>
  );
}

export default function ConcurConnect() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { module } = match.params;
  const isLoading = useSelector(selectors.isConcurDataLoading);
  const errorMessage = useSelector(selectors.concurErrorMessage);
  const query = useQuery();
  const id = query.get('id');
  const requestToken = query.get('requestToken');

  useEffect(() => {
    dispatch(actions.concur.connect({module, id, requestToken}));
  }, [dispatch, id, module, requestToken]);

  if (isLoading) return <Loader><Spinner /></Loader>;

  return (
    <div className={classes.root}>
      <div className={classes.box}>
        <div className={classes.innerbox} >
          {errorMessage?.length ? <ConcurConnectError message={errorMessage[0]} /> : <ConcurConnectSuccess module={module} />}
        </div>
      </div>
    </div>
  );
}
