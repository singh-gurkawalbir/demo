import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
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
import { PERMISSIONS } from '../../utils/constants';
import { generateNewId } from '../../utils/resource';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import actions from '../../actions';
import { TextButton } from '../../components/Buttons';

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
  sort: { orderBy: 'name', order: 'asc' },
};

export default function TemplateList(props) {
  const { location } = props;
  const classes = useStyles();
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

  return (
    <>
      <CheckPermissions
        permission={
          PERMISSIONS && PERMISSIONS.templates && PERMISSIONS.templates.view
        }>
        <ResourceDrawer {...props} />

        <CeligoPageBar title="Templates" infoText={InfoText.templates}>
          <div className={classes.actions}>
            <KeywordSearch
              filterKey={filterKey}
            />

            <TextButton
              data-test="addNewListing"
              component={Link}
              to={`${location.pathname}/add/templates/${generateNewId()}`}
              startIcon={<AddIcon />}>
              Create template
            </TextButton>
          </div>
        </CeligoPageBar>

        <div className={classes.resultContainer}>
          <LoadResources required resources={['templates', 'integrations']}>
            {list.count === 0 ? (
              <Typography>
                {list.total === 0
                  ? "You don't have any templates."
                  : 'Your search didn’t return any matching results. Try expanding your search criteria.'}
              </Typography>
            ) : (
              <ResourceTable resources={list.resources} resourceType="templates" />
            )}
          </LoadResources>
        </div>
        <ShowMoreDrawer
          filterKey="templates"
          count={list.count}
          maxCount={list.filtered}
        />
      </CheckPermissions>
    </>
  );
}
