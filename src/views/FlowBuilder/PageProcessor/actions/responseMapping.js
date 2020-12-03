import {useEffect} from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Icon from '../../../../components/icons/MapDataIcon';

function ResponseMapping({
  flowId,
  resource,
  onClose,
  open,
}) {
  const match = useRouteMatch();
  const history = useHistory();
  const {_id: resourceId} = resource;

  useEffect(() => {
    if (open && match.path.indexOf('mapping') === -1) {
      history.push(`${history.location.pathname}/responseMapping/${flowId}/${resourceId}`);
      onClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowId, history, onClose, open, resourceId]);

  return null;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'responseMapping',
  position: 'right',
  Icon,
  Component: ResponseMapping,
};
