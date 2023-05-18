import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TimeAgo, TextButton } from '@celigo/fuse-ui';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';

export default function LogDetailsLink({ logKey, resourceId, time }) {
  const dispatch = useDispatch();
  const activeLogKey = useSelector(state => selectors.activeLogKey(state, resourceId));

  const handleActionClick = useCallback(() => {
    dispatch(actions.logs.flowStep.setActiveLog(resourceId, logKey));
  }, [dispatch, resourceId, logKey]);

  return (
    <TextButton
      color="primary"
      sx={[
        {
          paddingLeft: '10px',
        },
        activeLogKey === logKey && {
          '&:before': {
            content: '""',
            width: 6,
            height: 'calc(100% + 20px)',
            position: 'absolute',
            left: '-16px',
            top: '-10px',
            backgroundColor: 'primary.main',
          },
        },
      ]}
      onClick={handleActionClick}>
      <TimeAgo date={time} />
    </TextButton>
  );
}
