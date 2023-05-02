import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Spinner } from '@celigo/fuse-ui';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import { TextButton } from '../../../../Buttons';

export default function ReinviteUser({ user }) {
  const dispatch = useDispatch();
  const reinviteStatus = useSelector(state => selectors.userReinviteStatus(state, user._id));

  const handleReinviteClick = useCallback(() => {
    dispatch(actions.user.org.users.reinvite(user._id));
  }, [dispatch, user]);

  if (reinviteStatus === 'loading') {
    return <Spinner />;
  }

  return (
    <TextButton onClick={handleReinviteClick}>Reinvite</TextButton>
  );
}
