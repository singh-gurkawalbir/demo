import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Button} from '@material-ui/core';
import actions from '../../../../../actions';
import { selectors } from '../../../../../reducers';
import Spinner from '../../../../Spinner';

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
    <Button onClick={handleReinviteClick}>Reinvite</Button>
  );
}
