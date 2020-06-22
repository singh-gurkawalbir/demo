import { useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EditIcon from '../../../../icons/EditIcon';
import * as selectors from '../../../../../reducers';
import { getIntegrationAppUrlName } from '../../../../../utils/integrationApps';


export default {
  label: 'Edit flow',
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
    const appName = useSelector(state => {
      if (!isIntegrationApp) return;

      const integration = selectors.resource(
        state,
        'integrations',
        integrationId
      );

      if (integration && integration.name) {
        return getIntegrationAppUrlName(integration.name);
      }
    });
    const flowBuilderPathName = isDataLoader ? 'dataLoader' : 'flowBuilder';
    const flowBuilderTo = isIntegrationApp
      ? `/pg/integrationApps/${appName}/${integrationId}/${flowBuilderPathName}/${flowId}`
      : `${flowBuilderPathName}/${flowId}`;

    useEffect(() => {
      history.push(flowBuilderTo);
    }, [history, flowBuilderTo]);


    return null;
  },
};
