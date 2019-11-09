import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../../../reducers';
import { STANDALONE_INTEGRATION } from '../../../../utils/constants';
import AttachFlowsDialog from '../../../../components/AttachFlows';
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
  const [showDialog, setShowDialog] = useState(false);
  let flows = useSelector(
    state => selectors.flowListWithMetadata(state, { type: 'flows' }).resources
  );
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
  // TODO: This next code should be moved into the <AttachFlowsDialog>
  // component. Its adding unnecessary complexity to this component.
  // This filtering used as a prop value to another component.
  const standaloneFlows =
    flows &&
    flows.filter(
      f => f._integrationId === STANDALONE_INTEGRATION.id || !f._integrationId
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
      {showDialog && (
        <AttachFlowsDialog
          integrationId={integrationId}
          standaloneFlows={standaloneFlows}
          onClose={() => setShowDialog(false)}
        />
      )}

      <PanelHeader title="Integration flows">
        <IconTextButton component={Link} to="flowBuilder/new">
          <AddIcon /> Create flow
        </IconTextButton>
        <IconTextButton onClick={() => setShowDialog(true)}>
          <AttachIcon /> Attach flow
        </IconTextButton>
      </PanelHeader>

      <LoadResources required resources="flows, connections, exports, imports">
        <ResourceTable resourceType="flows" resources={flows} />
      </LoadResources>
    </div>
  );
}
