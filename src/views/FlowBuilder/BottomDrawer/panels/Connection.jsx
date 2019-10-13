import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import LoadResources from '../../../../components/LoadResources';
import CeligoTable from '../../../../components/CeligoTable';
import metadata from '../../../../components/ResourceTable/metadata/connections';
import * as selectors from '../../../../reducers';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
  },
}));

export default function ConnectionPanel({ flow }) {
  const { pageProcessors = [], pageGenerators = [] } = flow;
  const classes = useStyles();
  const connectionIds = [];

  pageGenerators.forEach(pg => {
    if (pg._connectionId) {
      connectionIds.push(pg._connectionId);
    }
  });
  pageProcessors.forEach(pp => {
    if (pp._connectionId) {
      connectionIds.push(pp._connectionId);
    }
  });
  const connections = useSelector(state =>
    selectors.resources(state, 'connections', connectionIds)
  );

  return (
    <div className={classes.root}>
      <LoadResources required resources="connections">
        <CeligoTable
          data={connections}
          filterKey="connections"
          {...metadata}
          actionProps={{ resourceType: 'connections' }}
        />
      </LoadResources>
    </div>
  );
}
