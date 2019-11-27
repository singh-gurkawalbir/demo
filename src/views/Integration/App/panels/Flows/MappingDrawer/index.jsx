import { Fragment, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Button } from '@material-ui/core';
import mappingUtil from '../../../../../../utils/mapping';
import lookupUtil from '../../../../../../utils/lookup';
import useEnqueueSnackbar from '../../../../../../hooks/enqueueSnackbar';
import * as selectors from '../../../../../../reducers';
import actions from '../../../../../../actions';
import DrawerTitleBar from '../../../../../../components/drawer/TitleBar';
import LoadResources from '../../../../../../components/LoadResources';
import StandaloneMapping from '../../../../../../components/AFE/ImportMapping/StandaloneMapping';
import SelectImport from './SelectImport';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 800,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    borderTop: `solid 1px ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(0, 0, 0, 3),
  },
  mappingContainer: {
    overflow: 'auto',
    maxHeight: `calc(100vh - 180px)`,
    padding: theme.spacing(3, 0),
    marginBottom: theme.spacing(1),
  },
}));

function MappingDrawer() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { flowId, importId } = match.params;
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));
  const flowName = flow.name || flow._id;
  const mappingEditorId = `${importId}-${flowId}`;
  const {
    mappings,
    lookups,
    adaptorType,
    application,
    generateFields,
  } = useSelector(state => selectors.mapping(state, mappingEditorId));
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const handleClose = useCallback(() => {
    history.goBack();
  }, [history]);
  // TODO: This handler is a direct copy of /components/AFE/MappingDialog
  // save handler. We need to consolidate this code. It is also not very efficient
  // as logic and data is mixed in the data layer and component logic.
  // instead of us having to know that we need to validate the data by using the
  // mappingUtil.validateMappings, this could be done within the mapping selector.
  // Also note that we already have an editor interface and all efforts should be
  // to have the same interface across all AFEs. Currently mapping config is an outlier.
  const handleSave = useCallback(() => {
    const {
      isSuccess,
      errMessage: validationErrMsg,
    } = mappingUtil.validateMappings(mappings);

    if (!isSuccess) {
      enqueueSnackbar({
        message: validationErrMsg,
        variant: 'error',
      });

      return;
    }

    let mappingConfig = mappings.map(
      ({ index, hardCodedValueTmp, rowIdentifier, ...others }) => others
    );

    mappingConfig = mappingUtil.generateMappingsForApp({
      mappings: mappingConfig,
      generateFields,
      appType: application,
    });

    if (!mappingConfig) return;

    const patchSet = [
      {
        op: 'replace',
        path: mappingUtil.getMappingPath(adaptorType),
        value: mappingConfig,
      },
    ];

    // update _lookup only if its being passed as param to function
    if (lookups) {
      patchSet.push({
        op: 'replace',
        path: lookupUtil.getLookupPath(adaptorType),
        value: lookups,
      });
    }

    dispatch(actions.resource.patchStaged(importId, patchSet, 'value'));
    dispatch(actions.resource.commitStaged('imports', importId, 'value'));
  }, [
    adaptorType,
    application,
    dispatch,
    enqueueSnackbar,
    generateFields,
    importId,
    lookups,
    mappings,
  ]);

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
        <LoadResources required="true" resources="imports">
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
              <Button
                variant="contained"
                color="primary"
                data-test="saveImportMapping"
                onClick={handleSave}>
                Save
              </Button>
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
