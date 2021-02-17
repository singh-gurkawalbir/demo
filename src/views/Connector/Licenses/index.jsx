import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import CeligoPageBar from '../../../components/CeligoPageBar';
import IconTextButton from '../../../components/IconTextButton';
import AddIcon from '../../../components/icons/AddIcon';
import { selectors } from '../../../reducers';
import CeligoTable from '../../../components/CeligoTable';
import ResourceDrawer from '../../../components/drawer/Resource';
import ShowMoreDrawer from '../../../components/drawer/ShowMore';
import KeywordSearch from '../../../components/KeywordSearch';
import infoText from '../../ResourceList/infoText';
import actions from '../../../actions';
import metadata from './metadata';
import { generateNewId } from '../../../utils/resource';
import LoadResources from '../../../components/LoadResources';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { SCOPES } from '../../../sagas/resourceForm';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

const defaultFilter = {
  take: parseInt(process.env.DEFAULT_TABLE_ROW_COUNT, 10) || 10,
  searchBy: [
    'user.email',
    '_integrationId',
    'user._id',
    'user.name',
    'user.company',
    'environment',
  ],
};

export default function Licenses(props) {
  const { match, location, history } = props;
  const { connectorId } = match.params;
  const classes = useStyles();
  const resourceStatus = useSelectorMemo(
    selectors.makeAllResourceStatusSelector,
    ['connectorLicenses']
  );
  const sortFilterKey = 'connectorLicenses';
  const filter =
    useSelector(state => selectors.filter(state, sortFilterKey)) ||
    defaultFilter;
  const connectorLicensesFilterConfig = useMemo(
    () => ({
      ignoreEnvironmentFilter: true,
      type: 'connectorLicenses',
      ...defaultFilter,
      ...filter,
    }),
    [filter]
  );
  const list = useSelectorMemo(
    selectors.makeResourceListSelector,
    connectorLicensesFilterConfig
  );
  const connector = useSelector(state =>
    selectors.resource(state, 'connectors', connectorId)
  );
  const dispatch = useDispatch();
  const resourceLoaded = useMemo(() => resourceStatus && resourceStatus[0].isReady, [resourceStatus]);

  useEffect(() => {
    dispatch(
      actions.resource.requestCollection(`connectors/${connectorId}/licenses`)
    );

    return () =>
      dispatch(actions.resource.clearCollection('connectorLicenses'));
  }, [connectorId, dispatch]);

  const handleClick = useCallback(() => {
    const newId = generateNewId();
    const patchSet = [
      {
        op: 'add',
        path: '/_connectorId',
        value: connectorId,
      },
    ];

    if (connector.framework === 'twoDotZero') {
      patchSet.push({
        op: 'add',
        path: '/type',
        value: 'integrationApp',
      });
    }

    dispatch(actions.resource.patchStaged(newId, patchSet, SCOPES.VALUE));

    history.push(`${location.pathname}/add/connectorLicenses/${newId}`);
  }, [connectorId, connector, history, location, dispatch]);

  if (!connector) {
    return <LoadResources required resources="connectors" />;
  }

  return (
    <>
      {resourceLoaded && <ResourceDrawer {...props} />}
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
            onClick={handleClick}
            variant="text"
            color="primary">
            <AddIcon /> New license
          </IconTextButton>
        </div>
      </CeligoPageBar>
      <div className={classes.resultContainer}>
        <LoadResources required resources="integrations" >
          {list.count === 0 ? (
            <Typography>
              {list.total === 0
                ? 'You don\'t have any licenses.'
                : 'Your search didn’t return any matching results. Try expanding your search criteria.'}
            </Typography>
          ) : (
            <CeligoTable
              data={list.resources}
              {...metadata}
              filterKey={sortFilterKey}
              actionProps={{
                resourceType: `connectors/${connectorId}/licenses`,
              }}
          />
          )}
        </LoadResources>
      </div>
      <ShowMoreDrawer
        filterKey="connectorLicenses"
        count={list.count}
        maxCount={list.filtered}
      />
    </>
  );
}
