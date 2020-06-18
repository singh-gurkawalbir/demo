import { Typography } from '@material-ui/core';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as selectors from '../../reducers';
import ResourceTable from '../../components/ResourceTable';
import ResourceDrawer from '../../components/drawer/Resource';
import ShowMoreDrawer from '../../components/drawer/ShowMore';
import AddIcon from '../../components/icons/AddIcon';
import CeligoPageBar from '../../components/CeligoPageBar';
import actions from '../../actions';
import SearchInput from '../../components/SearchInput';
import IconTextButton from '../../components/IconTextButton';
import LoadResources from '../../components/LoadResources';
import infoText from '../ResourceList/infoText';
import CheckPermissions from '../../components/CheckPermissions';
import { PERMISSIONS } from '../../utils/constants';
import { generateNewId } from '../../utils/resource';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

const defaultFilter = {
  take: parseInt(process.env.DEFAULT_TABLE_ROW_COUNT, 10) || 10
};

export default function AccessTokenList(props) {
  const { integrationId, location } = props;
  const filter = useSelector(state =>
    selectors.filter(state, 'accesstokens') || defaultFilter
  );
  const list = useSelector(state =>
    selectors.accessTokenList(state, { integrationId, ...filter })
  );
  const classes = useStyles();
  const dispatch = useDispatch();
  const newProps = { ...props, resourceType: 'accesstokens' };
  const handleKeywordChange = e => {
    dispatch(
      actions.patchFilter('accesstokens', { keyword: e.target.value })
    );
  };

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
          <div className={classes.actions}>
            <SearchInput onChange={handleKeywordChange} />
            <IconTextButton
              data-test="newAccessToken"
              component={Link}
              to={`${location.pathname}/add/accesstokens/${generateNewId()}`}
              variant="text"
              color="primary">
              <AddIcon /> New API token
            </IconTextButton>
          </div>
        </CeligoPageBar>

        <div className={classes.resultContainer}>
          <LoadResources required resources="accesstokens">
            {list.count > 0 ? (
              <ResourceTable
                resourceType="accesstokens"
                resources={list.resources}
              />
            ) : (
              <Typography>
                {list.total === 0
                  ? "You don't have any API tokens."
                  : 'Your search didn’t return any matching results. Try expanding your search criteria.'}
              </Typography>
            )}
          </LoadResources>
        </div>
        <ShowMoreDrawer
          filterKey="accesstokens"
          count={list.count}
          maxCount={list.filtered}
        />
      </CheckPermissions>
    </>
  );
}
