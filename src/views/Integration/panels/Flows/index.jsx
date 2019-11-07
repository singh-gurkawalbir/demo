import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../../../reducers';
import { STANDALONE_INTEGRATION } from '../../../../utils/constants';
import LoadResources from '../../../../components/LoadResources';
import ResourceTable from '../../../../components/ResourceTable';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
}));

export default function FlowsPanel({ integrationId }) {
  const classes = useStyles();
  let flows = useSelector(
    state => selectors.flowListWithMetadata(state, { type: 'flows' }).resources
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
    <div className={classes.root}>
      <LoadResources required resources="flows, connections, exports, imports">
        <ResourceTable resourceType="flows" resources={flows} />
      </LoadResources>
    </div>
  );
}
