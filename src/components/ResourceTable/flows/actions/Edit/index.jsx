import { useCallback} from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EditIcon from '../../../../icons/EditIcon';
import { selectors } from '../../../../../reducers';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import { flowbuilderUrl } from '../../../../../utils/flows';

export default {
  key: 'editFlow',
  useLabel: () => 'Edit flow',
  icon: EditIcon,
  useOnClick: rowData => {
    const flowId = rowData._id;
    const integrationId = rowData._integrationId;
    const isIntegrationApp = !!rowData._connectorId;
    const history = useHistory();
    const isDataLoader = useSelector(state =>
      selectors.isDataLoader(state, flowId)
    );
    const appName = useSelectorMemo(selectors.integrationAppName, integrationId);
    const flowBuilderTo = flowbuilderUrl(flowId, integrationId, {isIntegrationApp, appName, isDataLoader});

    return useCallback(() => {
      history.push(flowBuilderTo);
    }, [history, flowBuilderTo]);
  },
};
