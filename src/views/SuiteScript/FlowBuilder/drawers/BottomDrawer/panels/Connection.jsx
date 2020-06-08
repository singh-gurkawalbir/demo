import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import LoadResources from '../../../../../../components/SuiteScript/LoadResources';
import CeligoTable from '../../../../../../components/CeligoTable';
import metadata from '../../../../../../components/ResourceTable/metadata/connections';
import * as selectors from '../../../../../../reducers';
import { Link, useRouteMatch } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
}));

export default function ConnectionPanel({ ssLinkedConnectionId, flow }) {
  const { _integrationId: integrationId } = flow;
  const classes = useStyles();
  const match = useRouteMatch();
  const flowConnections = useSelector(
    state =>
      selectors.suiteScriptIntegrationConnectionList(state, {
        ssLinkedConnectionId,
        integrationId,
      }),
    (left, right) => left.length === right.length
  );

  return (
    <div className={classes.root}>
      <LoadResources
        required
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
        resources="connections">
        <CeligoTable
          data={flowConnections}
          columns={[
            {
              heading: 'Name',
              value: r => (
                <Link
                  // onClick={onClick}
                  // if a user clicks to open a resource drawer (when the drawer is already opened),
                  // we should replace the top of the history stack
                  // so the back button does not need to traverse over
                  // all resources a user clicked on. This logic may change, but I think
                  // is better for UX and a good starting position to take.
                  // We "know (guess) that a drawer is already opened if the route path is not
                  // an exact match (url already contains drawer route segment)"
                  // replace={!match.isExact}
                  to={`${match.url}/edit/connections/${r._id}`}>
                  {r.name}
                </Link>
              ),
            },
          ]}
        />
      </LoadResources>
    </div>
  );
}
