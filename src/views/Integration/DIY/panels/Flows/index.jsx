import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import * as selectors from '../../../../../reducers';
import { STANDALONE_INTEGRATION } from '../../../../../utils/constants';
import AttachFlowsDialog from '../../../../../components/AttachFlows';
import LoadResources from '../../../../../components/LoadResources';
import IconTextButton from '../../../../../components/IconTextButton';
import AddIcon from '../../../../../components/icons/AddIcon';
import AttachIcon from '../../../../../components/icons/ConnectionsIcon';
import PanelHeader from '../../../common/PanelHeader';
import FlowCard from '../../../common/FlowCard';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function FlowsPanel({ integrationId }) {
  const isStandalone = integrationId === 'none';
  const classes = useStyles();
  const [showDialog, setShowDialog] = useState(false);
  let flows = useSelector(
    state => selectors.resourceList(state, { type: 'flows' }).resources
  );

  flows =
    flows &&
    flows.filter(
      f =>
        f._integrationId ===
        (integrationId === STANDALONE_INTEGRATION.id
          ? undefined
          : integrationId)
    );

  return (
    <div className={classes.root}>
      {showDialog && (
        <AttachFlowsDialog
          integrationId={integrationId}
          onClose={() => setShowDialog(false)}
        />
      )}

      <PanelHeader title="Integration flows">
        <IconTextButton
          component={Link}
          to="flowBuilder/new"
          data-test="createFlow">
          <AddIcon /> Create flow
        </IconTextButton>
        {!isStandalone && (
          <IconTextButton
            onClick={() => setShowDialog(true)}
            data-test="attachFlow">
            <AttachIcon /> Attach flow
          </IconTextButton>
        )}
      </PanelHeader>

      <LoadResources required resources="flows">
        {flows.map(f => (
          <FlowCard
            key={f._id}
            flowId={f._id}
            excludeActions={['mapping', 'schedule']}
          />
        ))}
      </LoadResources>
    </div>
  );
}
