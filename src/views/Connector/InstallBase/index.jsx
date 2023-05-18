import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { TextButton } from '@celigo/fuse-ui';
import CeligoPageBar from '../../../components/CeligoPageBar';
import { selectors } from '../../../reducers';
import CeligoTable from '../../../components/CeligoTable';
import ResourceDrawer from '../../../components/drawer/Resource';
import ShowMoreDrawer from '../../../components/drawer/ShowMore';
import KeywordSearch from '../../../components/KeywordSearch';
import LoadResources from '../../../components/LoadResources';
import actions from '../../../actions';
import metadata from './metadata';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { NO_RESULT_SEARCH_MESSAGE } from '../../../constants';
import NoResultTypography from '../../../components/NoResultTypography';
import messageStore from '../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));
const connectorLicenseFilterConfig = { type: 'connectorLicenses', ignoreEnvironmentFilter: true };
const defaultFilter = {
  take: parseInt(process.env.DEFAULT_TABLE_ROW_COUNT, 10) || 10,
  searchBy: ['email', '_integrationId', 'name', 'version', 'environment'],
};

export default function InstallBase(props) {
  const { match } = props;
  const { connectorId } = match.params;
  const filterKey = 'connectorInstallBase';
  const classes = useStyles();
  const filter =
    useSelector(state => selectors.filter(state, filterKey));
  const connectorInstallBaseConfig = useMemo(
    () => ({
      type: 'connectorInstallBase',
      ignoreEnvironmentFilter: true,
      ...(filter || {}),
    }),
    [filter]
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.patchFilter(filterKey, defaultFilter));
  },
  [dispatch]);
  const list = useSelectorMemo(
    selectors.makeResourceListSelector,
    connectorInstallBaseConfig
  );
  const licenses = useSelectorMemo(
    selectors.makeResourceListSelector,
    connectorLicenseFilterConfig
  ).resources;
  const connector = useSelector(state =>
    selectors.resource(state, 'connectors', connectorId)
  );
  const resources = list.resources && list.resources.map(r => {
    const license = licenses.find(l => l._integrationId === r._integrationId);

    return { ...r, _id: r._integrationId, license };
  });
  const [selected, setSelected] = useState({});
  const [selectedUsers, setSelectedUsers] = useState(0);
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
    <>
      <ResourceDrawer {...props} />
      <CeligoPageBar
        parentUrl="/connectors"
        title={`View / Update Install Base: ${connector.name}`}>
        <div className={classes.actions}>
          <KeywordSearch filterKey={filterKey} />
          <TextButton onClick={handleUpdateClick}>
            {selectedUsers ? `Update ${selectedUsers} user(s)` : 'Update'}
          </TextButton>
        </div>
      </CeligoPageBar>
      <div className={classes.resultContainer}>
        {list.count === 0 ? (
          <div>
            {list.total === 0
              ? <NoResultTypography>{messageStore('NO_RESULT', {message: 'install base'})}</NoResultTypography>
              : <NoResultTypography>{NO_RESULT_SEARCH_MESSAGE}</NoResultTypography>}
          </div>
        ) : (
          <CeligoTable
            data={resources}
            filterKey={filterKey}
            onSelectChange={handleSelectChange}
            {...metadata}
            selectableRows
          />
        )}
      </div>
      <ShowMoreDrawer
        filterKey={filterKey}
        count={list.count}
        maxCount={list.filtered}
      />
    </>
  );
}
