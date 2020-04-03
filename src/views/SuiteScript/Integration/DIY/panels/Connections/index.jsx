import { makeStyles } from '@material-ui/styles';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../../../reducers';
import PanelHeader from '../../../../../../components/PanelHeader';
import LoadSuiteScriptResources from '../../../../../../components/SuiteScript/LoadResources';
import CeligoTable from '../../../../../../components/CeligoTable';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    overflowX: 'scroll',
  },
}));

export default function ConnectionsPanel({
  integrationId,
  ssLinkedConnectionId,
}) {
  const classes = useStyles();
  const connections = useSelector(state =>
    selectors.suiteScriptIntegrationConnectionList(state, {
      ssLinkedConnectionId,
      integrationId,
    })
  );

  return (
    <div className={classes.root}>
      <PanelHeader title="Connections" />
      <LoadSuiteScriptResources
        required
        ssLinkedConnectionId={ssLinkedConnectionId}
        resources="flows,connections"
        integrationId={integrationId}>
        <CeligoTable
          data={connections}
          columns={[
            {
              heading: 'Name',
              value: r => r.Name,
            },
          ]}
        />
      </LoadSuiteScriptResources>
    </div>
  );
}
