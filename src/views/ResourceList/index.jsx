import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import ReactJson from 'react-json-view';
import shortid from 'shortid';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Paper } from '@material-ui/core';
import AddIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import CeligoPageBar from '../../AppNew/CeligoPageBar';
import { MODEL_PLURAL_TO_LABEL } from '../../utils/resource';
import infoText from './infoText';
import CeligoIconButton from '../../components/IconButton';
import * as selectors from '../../reducers';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';
import SearchInput from '../../components/SearchInput';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
  },
  resultContainer: {
    backgroundColor: 'yellow',
    // overflow: 'hidden',
    height: '100%',
  },
  gridContainer: {
    display: 'grid',
    height: '100%',
    // gridTemplateRows: `1fr 0fr`,
    gridTemplateRows: `auto ${theme.spacing(3)}px`,
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
  tail: {
    height: theme.spacing(8),
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
      take: filter.take || 3,
      keyword: filter.keyword,
    })
  );
  const handleMore = () => {
    dispatch(actions.patchFilter(resourceType, { take: +filter.take + 2 }));
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
          <SearchInput onChange={handleKeywordChange} />
          <CeligoIconButton
            component={Link}
            to={getRoutePath(`/${resourceType}/add/new-${shortid.generate()}`)}
            variant="text">
            <AddIcon /> New {resourceName}
          </CeligoIconButton>
        </div>
      </CeligoPageBar>
      <ReactJson
        // theme="google"
        collapsed={1}
        displayDataTypes={false}
        src={list}
      />

      {list.filtered > list.count && (
        <Fragment>
          <div className={classes.tail} />
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
        </Fragment>
      )}
    </Fragment>
  );
}

export default withRouter(PageContent);
