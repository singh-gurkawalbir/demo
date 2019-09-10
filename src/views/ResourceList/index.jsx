import { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Link, Route } from 'react-router-dom';
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
import SearchInput from '../../components/SearchInput';
import LoadResources from '../../components/LoadResources';
import ResourceTable from './ResourceTable';
import ResourceDrawer from '../../components/drawer/Resource';
import RegisterConnections from '../../components/RegisterConnections';

const useStyles = makeStyles(theme => ({
  actions: {
    display: 'flex',
    marginRight: '250px',
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
  const { match, location, integrationId } = props;
  const resourceType =
    (match && match.params && match.params.resourceType) ||
    (props && props.resourceType);
  const classes = useStyles();
  const dispatch = useDispatch();
  const filter = useSelector(state =>
    selectors.filter(state, resourceType)
  ) || { take: 3 };
  const list = useSelector(state =>
    selectors.resourceList(state, {
      type: resourceType,
      take: 3,
      integrationId,
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
  const [showRegisterConnDialog, setShowRegisterConnDialog] = useState(false);

  return (
    <Fragment>
      {showRegisterConnDialog && (
        <RegisterConnections
          integrationId={integrationId}
          onClose={() => setShowRegisterConnDialog(false)}
        />
      )}

      <Route
        path={`${match.url}/:operation/:resourceType/:id`}
        // Note that we disable the eslint warning since Route
        // uses "children" as a prop and this is the intended
        // use (per their docs)
        // eslint-disable-next-line react/no-children-prop
        children={props => <ResourceDrawer {...props} />}
      />
      <CeligoPageBar
        title={`${resourceName}s`}
        infoText={infoText[resourceType]}>
        <div className={classes.actions}>
          {resourceType === 'connections' &&
          integrationId &&
          integrationId !== 'none' ? (
            <CeligoIconButton
              onClick={() => setShowRegisterConnDialog(true)}
              variant="text">
              Register {`${resourceName}s`}
            </CeligoIconButton>
          ) : (
            <Fragment>
              <SearchInput variant="light" onChange={handleKeywordChange} />
              <CeligoIconButton
                component={Link}
                to={`${
                  location.pathname
                }/add/${resourceType}/new-${shortid.generate()}`}
                variant="text">
                <AddIcon /> New {resourceName}
              </CeligoIconButton>
            </Fragment>
          )}
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
