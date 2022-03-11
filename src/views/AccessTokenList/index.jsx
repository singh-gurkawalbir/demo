import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
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
import { NO_RESULT_SEARCH_MESSAGE, PERMISSIONS } from '../../utils/constants';
import { generateNewId } from '../../utils/resource';
import { TextButton } from '../../components/Buttons';
import NoResultMessageWrapper from '../../components/NoResultMessageWrapper';
import EmptyState from '../../components/EmptyState';
import FilledButton from '../../components/Buttons/FilledButton';
import emptyStateResource from '../../components/EmptyState/metadata';

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
};

const {apitokens} = emptyStateResource;
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
            <TextButton
              data-test="newAccessToken"
              component={Link}
              startIcon={<AddIcon />}
              to={`${location.pathname}/add/accesstokens/${generateNewId()}`}
              >
              Create API token
            </TextButton>
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
              <div>
                {list.total === 0
                  ? (
                    <EmptyState
                      title={apitokens.title}
                      subTitle={apitokens.subTitle}
                      type={apitokens.type}>
                      <FilledButton
                        data-test="newAccessToken"
                        component={Link}
                        to={`${location.pathname}/add/accesstokens/${generateNewId()}`}
                      >{apitokens.buttonLabel}
                      </FilledButton>
                      <TextButton
                        underline
                        href={apitokens.link}
                        target="_blank">
                        {apitokens.linkLabel}
                      </TextButton>
                    </EmptyState>
                  )
                  : <NoResultMessageWrapper>{NO_RESULT_SEARCH_MESSAGE}</NoResultMessageWrapper>}
              </div>
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
