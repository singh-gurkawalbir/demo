import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectors } from '../../reducers';
import ResourceTable from '../../components/ResourceTable';
import ResourceDrawer from '../../components/drawer/Resource';
import ShowMoreDrawer from '../../components/drawer/ShowMore';
import AddIcon from '../../components/icons/AddIcon';
import CeligoPageBar from '../../components/CeligoPageBar';
import actions from '../../actions';
import SearchInput from '../../components/SearchInput';
import LoadResources from '../../components/LoadResources';
import infoText from '../ResourceList/infoText';
import CheckPermissions from '../../components/CheckPermissions';
import { PERMISSIONS } from '../../constants';
import { generateNewId } from '../../utils/resource';
import { buildDrawerUrl, drawerPaths } from '../../utils/rightDrawer';
import { TextButton } from '../../components/Buttons';
import ResourceTableWrapper from '../../components/ResourceTableWrapper';
import ActionGroup from '../../components/ActionGroup';
import PageContent from '../../components/PageContent';

const defaultFilter = {
  take: parseInt(process.env.DEFAULT_TABLE_ROW_COUNT, 10) || 10,
};

export default function AccessTokenList(props) {
  const { integrationId, location } = props;
  const filter = useSelector(state =>
    selectors.filter(state, 'accesstokens') || defaultFilter
  );
  const list = useSelector(state =>
    selectors.accessTokenList(state, { integrationId, ...filter })
  );

  const dispatch = useDispatch();
  const newProps = { ...props, resourceType: 'accesstokens' };
  const handleKeywordChange = e => {
    dispatch(
      actions.patchFilter('accesstokens', { keyword: e.target.value })
    );
  };
  const showPagingBar = list.count >= 100;
  const hidePagingBar = list.count === list.filtered;

  return (
    <>
      <CheckPermissions
        permission={
          PERMISSIONS &&
          PERMISSIONS.accesstokens &&
          PERMISSIONS.accesstokens.view
        }>
        <ResourceDrawer {...newProps} />

        <CeligoPageBar title="API tokens" infoText={infoText.accesstokens}>
          <ActionGroup>
            <SearchInput onChange={handleKeywordChange} />
            <TextButton
              data-test="newAccessToken"
              component={Link}
              startIcon={<AddIcon />}
              to={buildDrawerUrl({
                path: drawerPaths.RESOURCE.ADD,
                baseUrl: location.pathname,
                params: { resourceType: 'accesstokens', id: generateNewId() },
              })} >
              Create API token
            </TextButton>
          </ActionGroup>
        </CeligoPageBar>

        <PageContent showPagingBar={showPagingBar} hidePagingBar={hidePagingBar}>
          <LoadResources required resources="accesstokens">
            <ResourceTableWrapper resourceType="accesstokens" hasNoData={!list.total} hasEmptySearchResults={list.total && !list.filtered}>
              <ResourceTable
                resourceType="accesstokens"
                resources={list.resources}
              />
            </ResourceTableWrapper>
          </LoadResources>
        </PageContent>
        <ShowMoreDrawer
          filterKey="accesstokens"
          count={list.count}
          maxCount={list.filtered}
        />
      </CheckPermissions>
    </>
  );
}
