import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import shortid from 'shortid';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '../../components/icons/AddIcon';
import CeligoPageBar from '../../components/CeligoPageBar';
import { MODEL_PLURAL_TO_LABEL } from '../../utils/resource';
import infoText from './infoText';
import CeligoIconButton from '../../components/IconButton';
import * as selectors from '../../reducers';
import actions from '../../actions';
import SearchInput from '../../components/SearchInput';
import LoadResources from '../../components/LoadResources';
import ResourceTable from '../../components/ResourceTable';
import ResourceDrawer from '../../components/drawer/Resource';
import ShowMoreDrawer from '../../components/drawer/ShowMore';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },
}));

function ResourceList(props) {
  const { match, location } = props;
  const { resourceType } = match.params;
  const classes = useStyles();
  const dispatch = useDispatch();
  const filter = useSelector(state =>
    selectors.filter(state, resourceType)
  ) || { take: 3 };
  const list = useSelector(state =>
    selectors.resourceList(state, {
      type: resourceType,
      take: 3,
      ...filter,
    })
  );
  const handleKeywordChange = e => {
    dispatch(
      actions.patchFilter(resourceType, { take: 3, keyword: e.target.value })
    );
  };

  const resourceName = MODEL_PLURAL_TO_LABEL[resourceType];

  return (
    <Fragment>
      <ResourceDrawer {...props} />

      <CeligoPageBar
        title={`${resourceName}s`}
        infoText={infoText[resourceType]}>
        <div className={classes.actions}>
          <SearchInput variant="light" onChange={handleKeywordChange} />
          <CeligoIconButton
            component={Link}
            to={`${
              location.pathname
            }/add/${resourceType}/new-${shortid.generate()}`}
            variant="text"
            color="primary">
            <AddIcon /> New {resourceName}
          </CeligoIconButton>
        </div>
      </CeligoPageBar>
      <div className={classes.resultContainer}>
        <LoadResources required resources={resourceType}>
          <ResourceTable
            resourceType={resourceType}
            resources={list.resources}
          />
        </LoadResources>
      </div>
      <ShowMoreDrawer
        filterKey={resourceType}
        count={list.count}
        maxCount={list.filtered}
      />
    </Fragment>
  );
}

export default withRouter(ResourceList);
