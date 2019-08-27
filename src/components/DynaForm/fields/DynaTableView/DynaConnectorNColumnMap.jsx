import { useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import DynaTableView from './';

export default function DynaConnectorNColumnMap(props) {
  const { optionsMap, id, _integrationId = '59e0645e0ae62504287461ce' } = props;
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

  return (
    <DynaTableView
      {...props}
      initSelector={initSelector}
      handleRefreshClickHandler={handleRefreshClick}
    />
  );
}
