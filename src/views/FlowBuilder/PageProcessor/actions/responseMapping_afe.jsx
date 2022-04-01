import React, {useEffect} from 'react';
import { useHistory, useRouteMatch, Redirect } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/MapDataIcon';
import { editorDrawerUrl } from '../../../../utils/rightDrawer';

function ResponseMapping({
  flowId,
  resourceType,
  resourceId,
  onClose,
  open,
}) {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const history = useHistory();
  const editorId = `responseMappings-${resourceId}`;

  useEffect(() => {
    if (open && match.path.indexOf('mapping') === -1) {
      onClose();

      dispatch(actions.editor.init(editorId, 'responseMappings', {
        flowId,
        resourceId,
        resourceType,
        stage: 'responseMappingExtract',
        data: {}, // adding dummy data here. Actual data gets loaded once the mapping init is complete
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowId, history, onClose, open, resourceId]);

  return open
    ? <Redirect push to={`${match.url}${editorDrawerUrl(editorId)}`} />
    : null;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'responseMapping',
  position: 'right',
  Icon,
  Component: ResponseMapping,
};
