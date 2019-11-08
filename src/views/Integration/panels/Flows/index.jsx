import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../../../reducers';
import { STANDALONE_INTEGRATION } from '../../../../utils/constants';
import LoadResources from '../../../../components/LoadResources';
import ResourceTable from '../../../../components/ResourceTable';
import IconTextButton from '../../../../components/IconTextButton';
import AddIcon from '../../../../components/icons/AddIcon';
import AttachIcon from '../../../../components/icons/ConnectionsIcon';
import PanelHeader from '../PanelHeader';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
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
      <PanelHeader title="Integration flows">
        <IconTextButton>
          <AddIcon /> Create flow
        </IconTextButton>
        <IconTextButton>
          <AttachIcon /> Attach flow
        </IconTextButton>
      </PanelHeader>

      <LoadResources required resources="flows, connections, exports, imports">
        <ResourceTable resourceType="flows" resources={flows} />
      </LoadResources>
    </div>
  );
}
