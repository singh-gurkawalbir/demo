import { Fragment, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Button } from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
import DrawerTitleBar from '../../../../../../components/drawer/TitleBar';
import LoadResources from '../../../../../../components/LoadResources';
import ButtonGroup from '../../../../../../components/ButtonGroup';
import StandaloneMapping from '../../../../../../components/AFE/ImportMapping/StandaloneMapping';
import SelectImport from './SelectImport';
import MappingSaveButton from '../../../../../../components/ResourceFormFactory/Actions/MappingSaveButton';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 824,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    backgroundColor: theme.palette.background.white,
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    borderTop: `solid 1px ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(0, 0, 0, 3),
  },
  mappingContainer: {
    // overflow: 'auto',
    height: `calc(100vh - 180px)`,
    padding: theme.spacing(1),
    paddingBottom: theme.spacing(3),
    marginBottom: theme.spacing(1),
  },
  buttonGroup: {
    '& button': { marginRight: theme.spacing(1) },
  },
}));

function MappingDrawer() {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { flowId, importId } = match.params;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));
  const flowName = flow.name || flow._id;
  const mappingEditorId = `${importId}-${flowId}`;
  const { visible: showMappings } = useSelector(state =>
    selectors.mapping(state, mappingEditorId)
  );
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);

  return (
    <Drawer
      // variant="persistent"
      anchor="right"
      open={!!match}
      classes={{
        paper: classes.drawerPaper,
      }}
      onClose={handleClose}>
      <DrawerTitleBar title={`Edit mapping for flow ${flowName}`} />
      <div className={classes.content}>
        <LoadResources required="true" resources="imports, exports">
          {importId ? (
            <Fragment>
              <div className={classes.mappingContainer}>
                <StandaloneMapping
                  id={mappingEditorId}
                  // why is this prop called resourceId? Is it possible to pass in
                  // any resourceID? I think now.. since it probably ONLY works with
                  // am importId, this prop should be called as such.
                  resourceId={importId}
                  flowId={flowId}
                />
              </div>
              {showMappings && (
                <ButtonGroup className={classes.buttonGroup}>
                  <MappingSaveButton
                    id={mappingEditorId}
                    color="primary"
                    dataTest="saveImportMapping"
                    submitButtonLabel="Save"
                  />
                  <MappingSaveButton
                    id={mappingEditorId}
                    variant="outlined"
                    color="secondary"
                    dataTest="saveAndCloseImportMapping"
                    onClose={handleClose}
                    submitButtonLabel="Save & Close"
                  />
                  <Button
                    variant="text"
                    data-test="saveImportMapping"
                    onClick={handleClose}>
                    Cancel
                  </Button>
                </ButtonGroup>
              )}
            </Fragment>
          ) : (
            <SelectImport flowId={flowId} />
          )}
        </LoadResources>
      </div>
    </Drawer>
  );
}

export default function MappingDrawerRoute(props) {
  const match = useRouteMatch();

  return (
    <Route
      exact
      path={[
        `${match.url}/:flowId/mapping`,
        `${match.url}/:flowId/mapping/:importId`,
      ]}>
      <MappingDrawer {...props} />
    </Route>
  );
}
