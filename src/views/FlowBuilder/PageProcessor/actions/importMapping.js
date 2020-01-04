import { Fragment } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer } from '@material-ui/core';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import Icon from '../../../../components/icons/MapDataIcon';
import helpTextMap from '../../../../components/Help/helpTextMap';
import LoadResources from '../../../../components/LoadResources';
import DrawerTitleBar from '../../../../components/drawer/TitleBar';
import StandaloneMapping from '../../../../components/AFE/ImportMapping/StandaloneMapping';

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
    width: '100%',
    display: 'flex',
  },
  // TODO:check for better way to handle width when drawer open and closes
  fullWidthDrawerClose: {
    width: 'calc(100% - 60px)',
  },
  fullWidthDrawerOpen: {
    width: `calc(100% - ${theme.drawerWidth}px)`,
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
  const { showSalesforceNetsuiteAssistant } = useSelector(state =>
    selectors.mapping(state, mappingEditorId)
  );
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  return (
    <Drawer
      anchor="right"
      open={open}
      classes={{
        paper: clsx(classes.drawerPaper, {
          [classes.fullWidthDrawerClose]:
            !drawerOpened && showSalesforceNetsuiteAssistant,
          [classes.fullWidthDrawerOpen]:
            drawerOpened && showSalesforceNetsuiteAssistant,
        }),
      }}>
      <DrawerTitleBar onClose={onClose} title="Define Import Mapping" />
      <div className={classes.content}>
        <LoadResources required="true" resources="imports, exports">
          <Fragment>
            <StandaloneMapping
              id={mappingEditorId}
              disabled={isMonitorLevelAccess}
              resourceId={resourceId}
              flowId={flowId}
              onClose={onClose}
            />
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
