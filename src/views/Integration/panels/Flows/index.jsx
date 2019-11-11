import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../../../reducers';
import { STANDALONE_INTEGRATION } from '../../../../utils/constants';
import AttachFlowsDialog from '../../../../components/AttachFlows';
import LoadResources from '../../../../components/LoadResources';
import IconTextButton from '../../../../components/IconTextButton';
import AddIcon from '../../../../components/icons/AddIcon';
import AttachIcon from '../../../../components/icons/ConnectionsIcon';
import PanelHeader from '../PanelHeader';
import FlowCard from './Card';

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
  // TODO: This next code should be moved into the <AttachFlowsDialog>
  // component. Its adding unnecessary complexity here.
  // This filtering is only used as a prop value to another component.
  const preferences = useSelector(state =>
    selectors.userProfilePreferencesProps(state)
  );
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
        {flows.map(
          ({ _id, name, description, disabled, lastModified, schedule }, i) => (
            <FlowCard
              key={_id}
              flowId={_id}
              // TODO: We need to add the logic to determine which status a flow is
              // in. for now, just cycle through the 3 options.
              status={
                // eslint-disable-next-line no-nested-ternary
                i % 3 === 1 ? 'warning' : i % 3 === 2 ? 'error' : 'success'
              }
              name={name}
              description={description}
              lastModified={lastModified}
              schedule={schedule}
              disabled={disabled}
            />
          )
        )}
      </LoadResources>
    </div>
  );
}
