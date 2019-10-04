import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CeligoPageBar from '../../../components/CeligoPageBar';
import * as selectors from '../../../reducers';
import CeligoTable from '../../../components/CeligoTable';
import ResourceDrawer from '../../../components/drawer/Resource';
import ShowMoreDrawer from '../../../components/drawer/ShowMore';
import KeywordSearch from '../../../components/KeywordSearch';
import actions from '../../../actions';
import metadata from './metadata';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

export default function Licenses(props) {
  const { match } = props;
  const { connectorId } = match.params;
  const classes = useStyles();
  const list = useSelector(state =>
    selectors.connectorLicenses(state, {
      connectorId,
      take: 5,
    })
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      actions.resource.requestCollection(`connectors/${connectorId}/licenses`)
    );
  }, [connectorId, dispatch]);

  return (
    <Fragment>
      <ResourceDrawer {...props} />
      <CeligoPageBar title="Licenses">
        <div className={classes.actions}>
          <KeywordSearch
            filterKey="connectorLicenses"
            defaultFilter={{ take: 5 }}
          />
        </div>
      </CeligoPageBar>
      <div className={classes.resultContainer}>
        <CeligoTable
          data={list.resources}
          {...metadata}
          actionProps={{ resourceType: `connectors/${connectorId}/licenses` }}
        />
      </div>
      <ShowMoreDrawer
        filterKey="connectorLicenses"
        count={list.count}
        maxCount={list.filtered}
      />
    </Fragment>
  );
}
