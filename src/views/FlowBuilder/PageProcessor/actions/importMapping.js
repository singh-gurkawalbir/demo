import { useEffect } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import Icon from '../../../../components/icons/MapDataIcon';

// mappings are only disabled in case of monitor level access
function ImportMapping({
  flowId,
  resource,
  onClose,
  open,
}) {
  const match = useRouteMatch();
  const history = useHistory();
  const {_id: importId} = resource;

  useEffect(() => {
    if (open && match.path.indexOf('mapping') === -1) {
      history.push(`${match.url}/mapping/${flowId}/${importId}`);
      onClose();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowId, match, history, importId, onClose, open]);

  return null;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'importMapping',
  position: 'middle',
  Icon,
  // TODO: This helpText prop can easily be derived in the parent code using the
  // name prop above. No need to add complexity to the metadata as refactoring may be
  // harder. What if we want to change the root path of all fb help text keys? We
  // will now need to modify every sibling action's metadata individually.
  helpKey: 'fb.pp.imports.importMapping',
  Component: ImportMapping,
};
