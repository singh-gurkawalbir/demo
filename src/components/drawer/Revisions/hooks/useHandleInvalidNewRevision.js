import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectors } from '../../../../reducers';

export default function useHandleInvalidNewRevision({ integrationId, revisionId, parentUrl }) {
  const history = useHistory();
  const isValidTempRevision = useSelector(state => !!selectors.tempRevisionInfo(state, integrationId, revisionId));

  useEffect(() => {
    if (!isValidTempRevision) {
      history.replace(parentUrl);
    }
  }, [isValidTempRevision, history, parentUrl]);
}
