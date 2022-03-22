import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { selectors } from '../../../../reducers';

export default function useHandleInvalidRevision({ integrationId, revisionId, parentUrl }) {
  const history = useHistory();
  const isValidRevision = useSelector(state => !!selectors.revision(state, integrationId, revisionId));

  useEffect(() => {
    if (!isValidRevision) {
      history.replace(parentUrl);
    }
  }, [isValidRevision, history, parentUrl]);
}
