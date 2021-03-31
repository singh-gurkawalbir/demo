import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {Button} from '@material-ui/core';
import actions from '../../../../../actions';

export default function ReinviteUser({ user }) {
  const dispatch = useDispatch();

  const handleReinviteClick = useCallback(() => {
    dispatch(actions.user.org.users.reinvite(user._id));
  }, [dispatch, user]);

  return (
    <Button onClick={handleReinviteClick}>Reinvite</Button>
  );
}
