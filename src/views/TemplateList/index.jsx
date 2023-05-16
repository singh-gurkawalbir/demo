import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import { TextButton } from '@celigo/fuse-ui';
import CeligoPageBar from '../../components/CeligoPageBar';
import { selectors } from '../../reducers';
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../../components/ResourceTable';
import ResourceDrawer from '../../components/drawer/Resource';
import ShowMoreDrawer from '../../components/drawer/ShowMore';
import KeywordSearch from '../../components/KeywordSearch';
import AddIcon from '../../components/icons/AddIcon';
import InfoText from '../ResourceList/infoText';
import CheckPermissions from '../../components/CheckPermissions';
import { NO_RESULT_SEARCH_MESSAGE, PERMISSIONS } from '../../constants';
import { generateNewId } from '../../utils/resource';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import actions from '../../actions';
import NoResultTypography from '../../components/NoResultTypography';
import { buildDrawerUrl, drawerPaths } from '../../utils/rightDrawer';
import ActionGroup from '../../components/ActionGroup';
import PageContent from '../../components/PageContent';
import messageStore from '../../utils/messageStore';

const defaultFilter = {
  take: parseInt(process.env.DEFAULT_TABLE_ROW_COUNT, 10) || 10,
  sort: { orderBy: 'name', order: 'asc' },
};

export default function TemplateList(props) {
  const { location } = props;
  const dispatch = useDispatch();
  const filterKey = 'templates';
  const filter =
    useSelector(state => selectors.filter(state, 'templates'));

  useEffect(() => {
    dispatch(actions.patchFilter(filterKey, defaultFilter));
  },
  [dispatch]);
  const templatesFilterConfig = useMemo(
    () => ({
      type: 'templates',
      ...(filter || {}),
    }),
    [filter]
  );
  const list = useSelectorMemo(
    selectors.makeResourceListSelector,
    templatesFilterConfig
  );

  const showPagingBar = list.count >= 100;
  const hidePagingBar = list.count === list.filtered;

  return (
    <>
      <CheckPermissions
        permission={
          PERMISSIONS && PERMISSIONS.templates && PERMISSIONS.templates.view
        }>
        <ResourceDrawer {...props} />

        <CeligoPageBar title="Templates" infoText={InfoText.templates}>
          <ActionGroup>
            <KeywordSearch filterKey={filterKey} />

            <TextButton
              data-test="addNewListing"
              component={Link}
              to={buildDrawerUrl({
                path: drawerPaths.RESOURCE.ADD,
                baseUrl: location.pathname,
                params: { resourceType: 'templates', id: generateNewId() },
              })}
              startIcon={<AddIcon />}>
              Create template
            </TextButton>
          </ActionGroup>
        </CeligoPageBar>

        <PageContent showPagingBar={showPagingBar} hidePagingBar={hidePagingBar}>
          <LoadResources required resources={['templates', 'integrations']}>
            {list.count === 0 ? (
              <Typography>
                {list.total === 0

                  ? <NoResultTypography>{messageStore('NO_RESULT', {message: 'templates'})}</NoResultTypography>
                  : <NoResultTypography>{NO_RESULT_SEARCH_MESSAGE}</NoResultTypography>}
              </Typography>
            ) : (
              <ResourceTable resources={list.resources} resourceType="templates" />
            )}
          </LoadResources>
        </PageContent>
        <ShowMoreDrawer
          filterKey="templates"
          count={list.count}
          maxCount={list.filtered}
        />
      </CheckPermissions>
    </>
  );
}
