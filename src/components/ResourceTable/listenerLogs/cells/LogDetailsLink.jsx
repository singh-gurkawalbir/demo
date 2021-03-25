import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import IconTextButton from '../../../IconTextButton';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';

const useStyles = makeStyles(theme => ({
  textColor: {
    color: theme.palette.primary.main,
  },
  rowClicked: {
    '&:before': {
      content: '""',
      width: 6,
      height: 'calc(100% + 20px)',
      position: 'absolute',
      left: -16,
      top: -10,
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export default function LogDetailsLink({ logKey, exportId, time }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const activeLogKey = useSelector(state => selectors.activeLogKey(state, exportId));

  const handleActionClick = useCallback(() => {
    dispatch(actions.logs.listener.setActiveLog(exportId, logKey));
  }, [dispatch, exportId, logKey]);

  return (
    <IconTextButton
      className={clsx(classes.textColor, {
        [classes.rowClicked]: activeLogKey === logKey,
      })}
      onClick={handleActionClick}>
      <CeligoTimeAgo date={time} />
    </IconTextButton>
  );
}
