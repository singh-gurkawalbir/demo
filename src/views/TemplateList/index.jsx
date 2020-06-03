import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import CeligoPageBar from '../../components/CeligoPageBar';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import CeligoTable from '../../components/CeligoTable';
import ResourceDrawer from '../../components/drawer/Resource';
import ShowMoreDrawer from '../../components/drawer/ShowMore';
import KeywordSearch from '../../components/KeywordSearch';
import IconTextButton from '../../components/IconTextButton';
import AddIcon from '../../components/icons/AddIcon';
import InfoText from '../ResourceList/infoText';
import metadata from './metadata';
import CheckPermissions from '../../components/CheckPermissions';
import { PERMISSIONS } from '../../utils/constants';
import { generateNewId } from '../../utils/resource';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

export default function TemplateList(props) {
  const { location } = props;
  const defaultFilter = useMemo(() => ({ take: 10 }), []);
  const classes = useStyles();
  const filter =
    useSelector(state => selectors.filter(state, 'templates')) || defaultFilter;
  const templatesFilterConfig = useMemo(
    () => ({
      type: 'templates',
      ...filter,
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
              filterKey="templates"
              defaultFilter={defaultFilter}
            />

            <IconTextButton
              data-test="addNewListing"
              component={Link}
              to={`${location.pathname}/add/templates/${generateNewId()}`}
              variant="text"
              color="primary">
              <AddIcon /> New listing
            </IconTextButton>
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
              <CeligoTable
                data={list.resources}
                filterKey="templates"
                {...metadata}
                actionProps={{ resourceType: 'templates' }}
              />
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
