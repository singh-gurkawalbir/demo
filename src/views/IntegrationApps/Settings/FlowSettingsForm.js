import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import { ActionsFactory } from '../../../components/ResourceFormFactory';

export default function ResourceFormFactory(props) {
  const { resourceType, onSubmitComplete, resourceId } = props;
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();
  const formState = useSelector(state =>
    selectors.integrationAppSettingsFormState(state)
  );

  useEffect(() => {
    dispatch(actions.integrationApp.settings.init());

    return () => dispatch(actions.integrationApp.settings.clear());
  }, [dispatch, resourceId, resourceType]);

  useEffect(() => {
    if (formState.submitComplete && onSubmitComplete) {
      onSubmitComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState.submitComplete /* , onSubmitComplete */]);

  const { fieldMeta } = formState;

  useEffect(() => {
    setCount(count => count + 1);
  }, [fieldMeta]);

  if (!formState.initComplete) {
    return <Typography>Initializing Form</Typography>;
  }

  return <ActionsFactory {...props} {...formState} key={count} />;
}
