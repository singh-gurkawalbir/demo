import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from '../../../../../../../components/Spinner';
import FilledButton from '../../../../../../../components/Buttons/FilledButton';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';

export default function ChildUpgradeButton({ resource }) {
  const dispatch = useDispatch();
  const { id } = resource;
  const [isInProgress, setIsInProgress] = useState(false);
  const [isInQueue, setIsInQueue] = useState(false);
  const status = useSelector(state => selectors.getStatus(state, id)?.status);
  const inQueue = useSelector(state => selectors.getStatus(state, id)?.inQueue);
  const currentChild = useSelector(state => selectors.currentChildUpgrade(state));

  useEffect(() => {
    if (status === 'done') {
      dispatch(actions.integrationApp.upgrade.setStatus(id, { inQueue: false }));
    }

    if (status === 'inProgress') {
      setIsInProgress(true);
    } else {
      setIsInProgress(false);
    }

    if (inQueue) {
      setIsInQueue(true);
    } else {
      setIsInQueue(false);
    }
  }, [dispatch, id, inQueue, status]);

  useEffect(() => {
    if (currentChild === id) {
      dispatch(actions.integrationApp.settings.v2.upgrade(id));
    }
  }, [dispatch, currentChild, id]);

  if (isInQueue) {
    return (
      <>
        {isInProgress ? (
          <Spinner centerAll size="small">Upgrading...</Spinner>
        ) : (
          <Spinner centerAll size="small">Waiting in Queue...</Spinner>
        )}
      </>
    );
  }

  return (
    <FilledButton
      disabled
    >
      Upgrade
    </FilledButton>
  );
}
