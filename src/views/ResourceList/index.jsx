import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
// import ReactJson from 'react-json-view';
import shortid from 'shortid';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import CeligoPageBar from '../../components/CeligoPageBar';
import { MODEL_PLURAL_TO_LABEL } from '../../utils/resource';
import infoText from './infoText';
import CeligoIconButton from '../../components/IconButton';
import * as selectors from '../../reducers';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';
import SearchInput from '../../components/SearchInput';
import LoadResources from '../../components/LoadResources';
import ResourceTable from './ResourceTable';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    padding: theme.spacing(3, 3, 12, 3),
  },

  pagingBar: {
    position: 'fixed',
    padding: theme.spacing(2),
    paddingLeft: theme.drawerWidth,
    // position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    textAlign: 'center',
    zIndex: theme.zIndex.appBar,
  },
}));

function PageContent(props) {
  const { match } = props;
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
  const handleMore = () => {
    dispatch(
      actions.patchFilter(resourceType, { take: (filter.take || 3) + 2 })
    );
  };

  const handleKeywordChange = e => {
    dispatch(
      actions.patchFilter(resourceType, { take: 3, keyword: e.target.value })
    );
  };

  const resourceName = MODEL_PLURAL_TO_LABEL[resourceType];

  return (
    <Fragment>
      <CeligoPageBar
        title={`${resourceName}s`}
        infoText={infoText[resourceType]}>
        <div className={classes.actions}>
          <SearchInput variant="light" onChange={handleKeywordChange} />
          <CeligoIconButton
            component={Link}
            to={getRoutePath(`/${resourceType}/add/new-${shortid.generate()}`)}
            variant="text">
            <AddIcon /> New {resourceName}
          </CeligoIconButton>
        </div>
      </CeligoPageBar>
      <div className={classes.resultContainer}>
        <LoadResources resources={resourceType}>
          <ResourceTable
            resourceType={resourceType}
            resources={list.resources}
          />
          {/* <ReactJson
            // theme="google"
            collapsed={2}
            displayDataTypes={false}
            src={list}
          /> */}
        </LoadResources>
      </div>
      {list.filtered > list.count && (
        <Paper elevation={10} className={classes.pagingBar}>
          <Button
            onClick={handleMore}
            variant="text"
            size="medium"
            color="primary"
            className={classes.button}>
            Show more results ({list.filtered - list.count} left)
          </Button>
        </Paper>
      )}
    </Fragment>
  );
}

export default withRouter(PageContent);
