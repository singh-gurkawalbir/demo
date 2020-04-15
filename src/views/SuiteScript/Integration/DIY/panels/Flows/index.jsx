import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../../../reducers';
import PanelHeader from '../../../../../../components/PanelHeader';
import LoadSuiteScriptResources from '../../../../../../components/SuiteScript/LoadResources';
import FlowCard from '../../../common/FlowCard';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function FlowsPanel({ ssLinkedConnectionId, integrationId }) {
  const classes = useStyles();
  const flows = useSelector(state =>
    selectors.suiteScriptResourceList(state, {
      resourceType: 'flows',
      integrationId,
      ssLinkedConnectionId,
    })
  );
  const infoTextFlow =
    'You can see the status, scheduling info, and when a flow was last modified, as well as mapping fields, enabling, and running your flow. You can view any changes to a flow, as well as what is contained within the flow, and even clone or download a flow.';

  return (
    <div className={classes.root}>
      <PanelHeader title="Integration flows" infoText={infoTextFlow} />
      <LoadSuiteScriptResources
        required
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
        resources="flows">
        {flows.map(f => (
          <FlowCard
            key={f._id}
            flowId={f._id}
            flowType={f.type}
            integrationId={integrationId}
            ssLinkedConnectionId={ssLinkedConnectionId}
            excludeActions={['schedule']}
          />
        ))}
      </LoadSuiteScriptResources>
    </div>
  );
}
