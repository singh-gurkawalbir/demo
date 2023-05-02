import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import makeStyles from '@mui/styles/makeStyles';
import { TimeAgo } from '@celigo/fuse-ui';
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

export default function LogDetailsLink({ logKey, resourceId, time }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const activeLogKey = useSelector(state => selectors.activeLogKey(state, resourceId));

  const handleActionClick = useCallback(() => {
    dispatch(actions.logs.flowStep.setActiveLog(resourceId, logKey));
  }, [dispatch, resourceId, logKey]);

  return (
    <TextButton
      color="primary"
      className={clsx(classes.textColor, {
        [classes.rowClicked]: activeLogKey === logKey,
      })}
      onClick={handleActionClick}>
      <TimeAgo date={time} />
    </TextButton>
  );
}
