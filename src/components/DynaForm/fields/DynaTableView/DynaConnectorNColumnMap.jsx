import { useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import DynaTableView from './DynaTable';

export default function DynaConnectorNColumnMap(props) {
  const { optionsMap, id, _integrationId } = props;
  const dispatch = useDispatch();

  function initSelector(state) {
    return selectors.connectorMetadata(
      state,
      id,
      null,
      _integrationId,
      optionsMap
    );
  }

  function handleRefreshClick(fieldId) {
    dispatch(actions.connectors.refreshMetadata(fieldId, id, _integrationId));
  }

  function handleCleanup() {
    dispatch(actions.connectors.clearMetadata(id, _integrationId));
  }

  return (
    <DynaTableView
      {...props}
      initSelector={initSelector}
      handleCleanupHandler={handleCleanup}
      handleRefreshClickHandler={handleRefreshClick}
    />
  );
}
