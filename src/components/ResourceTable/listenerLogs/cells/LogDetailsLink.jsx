import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';
import CeligoTimeAgo from '../../../CeligoTimeAgo';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import { TextButton } from '../../../Buttons';

const useStyles = makeStyles(theme => ({
  textColor: {
    paddingLeft: 10,
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
    dispatch(actions.logs.flowStep.setActiveLog(exportId, logKey));
  }, [dispatch, exportId, logKey]);

  return (
    <TextButton
      color="primary"
      className={clsx(classes.textColor, {
        [classes.rowClicked]: activeLogKey === logKey,
      })}
      onClick={handleActionClick}>
      <CeligoTimeAgo date={time} />
    </TextButton>
  );
}
