import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CeligoPageBar from '../../../components/CeligoPageBar';
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
import { TextButton } from '../../../components/Buttons';
import { NO_RESULT_SEARCH_MESSAGE } from '../../../constants';
import NoResultTypography from '../../../components/NoResultTypography';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';
import ActionGroup from '../../../components/ActionGroup';
import PageContent from '../../../components/PageContent';
import messageStore from '../../../utils/messageStore';
import customCloneDeep from '../../../utils/customCloneDeep';

const defaultFilter = {
  take: parseInt(process.env.DEFAULT_TABLE_ROW_COUNT, 10) || 10,
  sort: { order: 'desc', orderBy: 'expires' },
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
  const resourceStatus = useSelectorMemo(
    selectors.makeAllResourceStatusSelector,
    'connectorLicenses'
  );
  const filterKey = 'connectorLicenses';
  const filter =
    useSelector(state => selectors.filter(state, filterKey));
  const connectorLicensesFilterConfig = useMemo(
    () => ({
      ignoreEnvironmentFilter: true,
      type: 'connectorLicenses',
      ...(filter || {}),
    }),
    [filter]
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.patchFilter(filterKey, defaultFilter));
  },
  [dispatch]);

  useEffect(() => {
    const urlFields = location ? location?.pathname.split('/') : [];

    // strip the '/add...' suffix from the url
    // this is used since when user reloads the page with create license drawer open
    // we will need to close the drawer since it requires some context which we are setting
    // in handleClick methode below
    if (urlFields.indexOf('add') !== -1) {
      const redirectToParentRoute = urlFields.slice(0, urlFields.indexOf('add')).join('/');

      history.replace(redirectToParentRoute);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const list = useSelectorMemo(
    selectors.makeResourceListSelector,
    connectorLicensesFilterConfig
  );
  const connector = useSelector(state =>
    selectors.resource(state, 'connectors', connectorId)
  );
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

    dispatch(actions.resource.patchStaged(newId, patchSet));

    history.push(buildDrawerUrl({
      path: drawerPaths.RESOURCE.ADD,
      baseUrl: location.pathname,
      params: { resourceType: 'connectorLicenses', id: newId },
    }));
  }, [connectorId, connector, history, location, dispatch]);

  if (!connector) {
    return <LoadResources required resources="connectors" />;
  }

  const showPagingBar = list.count >= 100;
  const hidePagingBar = list.count === list.filtered;

  return (
    <>
      {resourceLoaded && <ResourceDrawer {...props} />}
      <CeligoPageBar
        parentUrl="/connectors"
        title={`Licenses: ${connector.name}`}
        infoText={infoText.licenses}>
        <ActionGroup>
          <KeywordSearch filterKey={filterKey} />
          <TextButton
            onClick={handleClick}
            startIcon={<AddIcon />}>
            New license
          </TextButton>
        </ActionGroup>
      </CeligoPageBar>
      <PageContent showPagingBar={showPagingBar} hidePagingBar={hidePagingBar}>
        <LoadResources required resources="integrations" >
          {list.count === 0 ? (
            <div>
              {list.total === 0

                ? <NoResultTypography> {messageStore('NO_RESULT', {message: 'licenses'})}</NoResultTypography>
                : <NoResultTypography>{NO_RESULT_SEARCH_MESSAGE}</NoResultTypography>}
            </div>
          ) : (
            <CeligoTable
              data={customCloneDeep(list.resources)}
              {...metadata}
              filterKey={filterKey}
              actionProps={{
                resourceType: `connectors/${connectorId}/licenses`,
              }}
          />
          )}
        </LoadResources>
      </PageContent>
      <ShowMoreDrawer
        filterKey={filterKey}
        count={list.count}
        maxCount={list.filtered}
      />
    </>
  );
}
