import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import shortid from 'shortid';
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

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

export default function AccessTokenList(props) {
  const { match, location } = props;
  const { integrationId } = match.params;
  const filter = useSelector(state =>
    selectors.filter(state, 'accesstokens')
  ) || { take: 3 };
  const list = useSelector(state =>
    selectors.accessTokenList(state, { integrationId, take: 3, ...filter })
  );
  const classes = useStyles();
  const dispatch = useDispatch();
  const newProps = { ...props, resourceType: 'accesstokens' };
  const handleKeywordChange = e => {
    dispatch(
      actions.patchFilter('accesstokens', { take: 3, keyword: e.target.value })
    );
  };

  return (
    <Fragment>
      <ResourceDrawer {...newProps} />

      <CeligoPageBar title="Access Tokens" infoText={infoText.accesstokens}>
        <div className={classes.actions}>
          <SearchInput variant="light" onChange={handleKeywordChange} />
          <IconTextButton
            component={Link}
            to={`${
              location.pathname
            }/add/accesstokens/new-${shortid.generate()}`}
            variant="text"
            color="primary">
            <AddIcon /> New Access Token
          </IconTextButton>
        </div>
      </CeligoPageBar>
      <div className={classes.resultContainer}>
        <LoadResources required resources="accesstokens">
          <ResourceTable
            resourceType="accesstokens"
            resources={list.resources}
          />
        </LoadResources>
      </div>
      <ShowMoreDrawer
        filterKey="accesstokens"
        count={list.count}
        maxCount={list.filtered}
      />
    </Fragment>
  );
}
