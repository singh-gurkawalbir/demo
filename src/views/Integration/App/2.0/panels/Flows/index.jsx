import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../../../../reducers';
import actions from '../../../../../../actions';
import LoadResources from '../../../../../../components/LoadResources';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  errorStatus: {
    justifyContent: 'center',
    height: 'unset',
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    fontSize: '12px',
  },
  divider: {
    width: 1,
    height: 30,
    borderLeft: `1px solid ${theme.palette.secondary.lightest}`,
    margin: 5,
  },
}));

export default function FlowsPanel({ integrationId }) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { status } = useSelector(state =>
    selectors.errorMap(state, integrationId)
  );
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isUserInErrMgtTwoDotZero(state)
  );

  useEffect(() => {
    if (!status && isUserInErrMgtTwoDotZero) {
      dispatch(
        actions.errorManager.integrationErrors.request({ integrationId })
      );
    }
  }, [dispatch, integrationId, isUserInErrMgtTwoDotZero, status]);

  return (
    <div className={classes.root}>

      <LoadResources required resources="flows,exports" />
    </div>
  );
}
