import { useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EditIcon from '../../../../icons/EditIcon';
import { selectors } from '../../../../../reducers';
import useSelectorMemo from '../../../../../hooks/selectors/useSelectorMemo';
import { flowbuilderUrl } from '../../../../../utils/flows';

export default {
  useLabel: () => 'Edit flow',
  icon: EditIcon,
  component: function Edit(props) {
    const { rowData = {} } = props;

    const flowId = rowData._id;
    const integrationId = rowData._integrationId;
    const isIntegrationApp = !!rowData._connectorId;
    const history = useHistory();
    const isDataLoader = useSelector(state =>
      selectors.isDataLoader(state, flowId)
    );
    const appName = useSelectorMemo(selectors.integrationAppName, integrationId);
    const flowBuilderTo = flowbuilderUrl(flowId, integrationId, {isIntegrationApp, appName, isDataLoader});

    useEffect(() => {
      history.push(flowBuilderTo);
    }, [history, flowBuilderTo]);

    return null;
  },
};
