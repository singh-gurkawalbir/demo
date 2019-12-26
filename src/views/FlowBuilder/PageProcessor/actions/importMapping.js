import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import { Drawer, Button, ButtonGroup } from '@material-ui/core';
import * as selectors from '../../../../reducers';
import Icon from '../../../../components/icons/MapDataIcon';
import helpTextMap from '../../../../components/Help/helpTextMap';
import LoadResources from '../../../../components/LoadResources';
import DrawerTitleBar from '../../../../components/drawer/TitleBar';
import StandaloneMapping from '../../../../components/AFE/ImportMapping/StandaloneMapping';
import MappingSaveButton from '../../../../components/ResourceFormFactory/Actions/MappingSaveButton';

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
    overflow: 'auto',
    maxHeight: `calc(100vh - 180px)`,
    padding: theme.spacing(3),
    paddingTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

// mappings are only disabled in case of monitor level access
function ImportMapping({
  flowId,
  isMonitorLevelAccess,
  resource,
  onClose,
  open,
}) {
  const classes = useStyles();
  const resourceId = resource._id;
  const mappingEditorId = `${resourceId}-${flowId}`;
  const { visible: showMappings } = useSelector(state =>
    selectors.mapping(state, mappingEditorId)
  );

  return (
    <Drawer
      anchor="right"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}>
      <DrawerTitleBar onClose={onClose} title="Define Import Mapping" />
      <div className={classes.content}>
        <LoadResources required="true" resources="imports, exports">
          <Fragment>
            <div className={classes.mappingContainer}>
              <StandaloneMapping
                id={mappingEditorId}
                disabled={isMonitorLevelAccess}
                resourceId={resourceId}
                flowId={flowId}
              />
            </div>
            {showMappings && (
              <ButtonGroup>
                <MappingSaveButton
                  disabled={isMonitorLevelAccess}
                  id={mappingEditorId}
                  color="primary"
                  dataTest="saveImportMapping"
                  submitButtonLabel="Save"
                />
                <MappingSaveButton
                  id={mappingEditorId}
                  disabled={isMonitorLevelAccess}
                  variant="outlined"
                  color="secondary"
                  dataTest="saveAndCloseImportMapping"
                  submitButtonLabel="Save & Close"
                />

                <Button variant="text" data-test="cancel" onClick={onClose}>
                  Cancel
                </Button>
              </ButtonGroup>
            )}
          </Fragment>
        </LoadResources>
      </div>
    </Drawer>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'importMapping',
  position: 'middle',
  Icon,
  // TODO: This helpText prop can easily be derived in the parent code using the
  // name prop above. No need to add complexity to the metadata as refactoring may be
  // harder. What if we want to change the root path of all fb help text keys? We
  // will now need to modify every sibling action's metadata individually.
  helpText: helpTextMap['fb.pp.imports.importMapping'],
  Component: ImportMapping,
};
