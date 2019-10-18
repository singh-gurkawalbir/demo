import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import LoadResources from '../../../../../components/LoadResources';
import CeligoTable from '../../../../../components/CeligoTable';
import metadata from '../../../../../components/ResourceTable/metadata/connections';
import * as selectors from '../../../../../reducers';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
}));

export default function ConnectionPanel({ flow }) {
  const classes = useStyles();
  const flowConnections = useSelector(state =>
    selectors.flowConnectionList(state, flow)
  );

  return (
    <div className={classes.root}>
      <LoadResources required resources="connections">
        <CeligoTable
          data={flowConnections}
          filterKey="connections"
          {...metadata}
          actionProps={{ resourceType: 'connections' }}
        />
      </LoadResources>
    </div>
  );
}
