import { useSelector } from 'react-redux';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../ResourceList/ResourceTable';
import { STANDALONE_INTEGRATION } from '../../utils/constants';

function Flows(props) {
  const { match } = props;
  const { integrationId } = match.params;
  let flows = useSelector(
    state => selectors.resourceList(state, { type: 'flows' }).resources
  );
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );

  flows =
    flows &&
    flows.filter(
      f =>
        f._integrationId ===
          (integrationId === STANDALONE_INTEGRATION.id
            ? undefined
            : integrationId) &&
        !!f.sandbox === (preferences.environment === 'sandbox')
    );

  return (
    <LoadResources required resources="flows">
      <ResourceTable resourceType="flows" resources={flows} />
    </LoadResources>
  );
}

export default Flows;
