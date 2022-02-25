import React, { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shortid from 'shortid';
import actions from '../../../../../actions';
import {FilledButton} from '../../../../../components/Buttons';

export default function Revisions({ integrationId }) {
  const dispatch = useDispatch();
  const revisions = useSelector(state => state?.data?.resources?.revisions);

  // call resource collection action
  useEffect(() => {
    dispatch(
      actions.resource.requestCollection(`integrations/${integrationId}/revisions`)
    );
  }, [integrationId, dispatch]);

  return (
    <>
      <div> test </div>
      <FilledButton
        data-test="save"
        onClick={() => {
          dispatch(
            actions.resource.received(`integrations/${integrationId}/revisions`, { _id: shortid.generate(), value: 'test123'})
          );
        }}>

        Click me
      </FilledButton>
      {JSON.stringify(revisions)}
    </>
  );
}
