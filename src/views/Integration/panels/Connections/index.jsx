import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import LoadResources from '../../../../components/LoadResources';
import CeligoTable from '../../../../components/CeligoTable';
import metadata from '../../../../components/ResourceTable/metadata/connections';
import * as selectors from '../../../../reducers';
import IconTextButton from '../../../../components/IconTextButton';
import AddIcon from '../../../../components/icons/AddIcon';
import RefreshIcon from '../../../../components/icons/RefreshIcon';
import PanelHeader from '../PanelHeader';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
  },
}));

export default function ConnectionsPanel({ integrationId }) {
  const classes = useStyles();
  const connections = useSelector(state =>
    selectors.integrationConnectionList(state, integrationId)
  );

  return (
    <div className={classes.root}>
      <PanelHeader title="Connections">
        <IconTextButton>
          <AddIcon /> Create connection
        </IconTextButton>
        <IconTextButton>
          <RefreshIcon /> Refresh
        </IconTextButton>
      </PanelHeader>

      <LoadResources required resources="connections">
        <CeligoTable
          data={connections}
          {...metadata}
          actionProps={{ integrationId }}
        />
      </LoadResources>
    </div>
  );
}
