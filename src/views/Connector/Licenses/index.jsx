import { Fragment, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CeligoPageBar from '../../../components/CeligoPageBar';
import IconTextButton from '../../../components/IconTextButton';
import AddIcon from '../../../components/icons/AddIcon';
import * as selectors from '../../../reducers';
import CeligoTable from '../../../components/CeligoTable';
import ResourceDrawer from '../../../components/drawer/Resource';
import ShowMoreDrawer from '../../../components/drawer/ShowMore';
import KeywordSearch from '../../../components/KeywordSearch';
import infoText from '../../ResourceList/infoText';
import actions from '../../../actions';
import metadata from './metadata';
import { generateNewId } from '../../../utils/resource';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

export default function Licenses(props) {
  const defaultFilter = useMemo(() => ({ take: 5 }), []);
  const { match, location, history } = props;
  const { connectorId } = match.params;
  const classes = useStyles();
  const filter =
    useSelector(state => selectors.filter(state, 'connectorLicenses')) ||
    defaultFilter;
  const list = useSelector(state =>
    selectors.resourceList(state, {
      type: 'connectorLicenses',
      ...{ ...defaultFilter, ...filter },
    })
  );
  const connector = useSelector(state =>
    selectors.resource(state, 'connectors', connectorId)
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      actions.resource.requestCollection(`connectors/${connectorId}/licenses`)
    );

    return () =>
      dispatch(actions.resource.clearCollection('connectorLicenses'));
  }, [connectorId, dispatch]);

  return (
    <Fragment>
      <ResourceDrawer {...props} />
      <CeligoPageBar
        history={history}
        title={`Licenses: ${connector.name}`}
        infoText={infoText.licenses}>
        <div className={classes.actions}>
          <KeywordSearch
            filterKey="connectorLicenses"
            defaultFilter={defaultFilter}
          />
          <IconTextButton
            component={Link}
            to={`${location.pathname}/add/connectorLicenses/${generateNewId()}`}
            variant="text"
            color="primary">
            <AddIcon /> New License
          </IconTextButton>
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
