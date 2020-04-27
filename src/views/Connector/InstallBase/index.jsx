import { Fragment, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CeligoPageBar from '../../../components/CeligoPageBar';
import * as selectors from '../../../reducers';
import CeligoTable from '../../../components/CeligoTable';
import ResourceDrawer from '../../../components/drawer/Resource';
import IconTextButton from '../../../components/IconTextButton';
import ShowMoreDrawer from '../../../components/drawer/ShowMore';
import KeywordSearch from '../../../components/KeywordSearch';
import LoadResources from '../../../components/LoadResources';
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

export default function InstallBase(props) {
  const defaultFilter = useMemo(
    () => ({
      take: 10,
      searchBy: ['email', '_integrationId', 'name', 'version', 'environment'],
    }),
    []
  );
  const { match, history } = props;
  const { connectorId } = match.params;
  const sortFilterKey = 'connectorInstallBase';
  const classes = useStyles();
  const filter =
    useSelector(state => selectors.filter(state, sortFilterKey)) ||
    defaultFilter;
  const list = useSelector(state =>
    selectors.resourceList(state, {
      type: 'connectorInstallBase',
      ...{ ...defaultFilter, ...filter },
    })
  );
  const { resources: licenses } = useSelector(state =>
    selectors.resourceList(state, { type: 'connectorLicenses' })
  );
  const connector = useSelector(state =>
    selectors.resource(state, 'connectors', connectorId)
  );
  const resources = list.resources.map(r => {
    const license = licenses.find(l => l._integrationId === r._integrationId);

    return { ...r, _id: r._integrationId, license };
  });
  const [selected, setSelected] = useState({});
  const [selectedUsers, setSelectedUsers] = useState(0);
  const dispatch = useDispatch();
  const handleSelectChange = (installBaseItems = {}) => {
    setSelected(installBaseItems);
    const count = Object.keys(installBaseItems).reduce(
      (count, cur) => (installBaseItems[cur] ? count + 1 : count),
      0
    );

    setSelectedUsers(count);
  };

  const handleUpdateClick = () => {
    const _integrationIds = Object.keys(selected).filter(
      key => selected[key] === true
    );

    dispatch(
      actions.connectors.installBase.update({
        _integrationIds,
        connectorId,
      })
    );
    dispatch(
      actions.resource.requestCollection(
        `connectors/${connectorId}/installBase`
      )
    );
  };

  useEffect(() => {
    dispatch(
      actions.resource.requestCollection(
        `connectors/${connectorId}/installBase`
      )
    );

    return () =>
      dispatch(actions.resource.clearCollection('connectorInstallBase'));
  }, [connectorId, dispatch]);

  useEffect(() => {
    dispatch(
      actions.resource.requestCollection(`connectors/${connectorId}/licenses`)
    );

    return () =>
      dispatch(actions.resource.clearCollection('connectorLicenses'));
  }, [connectorId, dispatch]);

  if (!connector) {
    return <LoadResources required resources="connectors" />;
  }

  return (
    <Fragment>
      <ResourceDrawer {...props} />
      <CeligoPageBar
        history={history}
        title={`View / Update Install Base: ${connector.name}`}>
        <div className={classes.actions}>
          <KeywordSearch
            filterKey="connectorInstallBase"
            defaultFilter={defaultFilter}
          />
          <IconTextButton onClick={handleUpdateClick} variant="text">
            {selectedUsers ? `Update ${selectedUsers} user(s)` : 'Update'}
          </IconTextButton>
        </div>
      </CeligoPageBar>
      <div className={classes.resultContainer}>
        <CeligoTable
          data={resources}
          filterKey={sortFilterKey}
          onSelectChange={handleSelectChange}
          {...metadata}
          selectableRows
        />
      </div>
      <ShowMoreDrawer
        filterKey="connectorInstallBase"
        count={list.count}
        maxCount={list.filtered}
      />
    </Fragment>
  );
}
