import { Fragment, useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Drawer, Button, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import Icon from '../../../../components/icons/MapDataIcon';
import helpTextMap from '../../../../components/Help/helpTextMap';
import LoadResources from '../../../../components/LoadResources';
import DrawerTitleBar from '../../../../components/drawer/TitleBar';
import StandaloneMapping from '../../../../components/AFE/ImportMapping/StandaloneMapping';
import { getNetSuiteSubrecordImports } from '../../../../utils/resource';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    marginTop: theme.appBarHeight,
    width: 824,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
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
  text: {
    marginBottom: theme.spacing(2),
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
  const [selectedMapping, setSelectedMapping] = useState(null);
  const classes = useStyles();
  const resourceId = resource._id;
  const mappingEditorId = `${resourceId}-${flowId}`;
  const { showSalesforceNetsuiteAssistant } = useSelector(state =>
    selectors.mapping(state, mappingEditorId)
  );
  const handleClose = (...args) => {
    setSelectedMapping(null);
    onClose(...args);
  };

  const subrecords = useSelector(
    state => {
      const mapping = selectors.mapping(state, mappingEditorId);

      if (
        mapping &&
        mapping.resource &&
        mapping.resource.netsuite_da &&
        mapping.resource.netsuite_da.mapping
      ) {
        const subrecords = getNetSuiteSubrecordImports(mapping.resource).map(
          sr => ({
            ...sr,
            name: `${mapping.resource.name || mapping.resource._id} - ${
              sr.name
            } (Subrecord)`,
          })
        );

        if (subrecords.length > 0) {
          return [
            {
              fieldId: '__parent',
              name: mapping.resource.name || mapping.resource._id,
            },
            ...subrecords,
          ];
        }

        return subrecords;
      }
    },
    (left, right) => left && right && left.length === right.length
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
      <DrawerTitleBar
        onClose={handleClose}
        title={
          subrecords && subrecords.length > 0 && !selectedMapping
            ? 'Please select which mapping you would like to edit'
            : 'Define Import Mapping'
        }
      />
      <div className={classes.content}>
        <LoadResources
          required="true"
          resources="imports, exports, connections">
          <Fragment>
            {subrecords && subrecords.length > 0 && !selectedMapping ? (
              <div>
                <Typography className={classes.text} variant="h5">
                  This import contains subrecord imports, select which import
                  you would like to edit the mapping for.
                </Typography>
                {subrecords.map((sr, index) => (
                  <div data-test={`subrecordMapping-${index}`} key={sr.id}>
                    <Button
                      className={classes.button}
                      onClick={() => {
                        setSelectedMapping(sr.fieldId);
                      }}>
                      <Typography variant="h6" color="primary">
                        {sr.name || sr.id}
                      </Typography>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <StandaloneMapping
                id={mappingEditorId}
                disabled={isMonitorLevelAccess}
                resourceId={resourceId}
                flowId={flowId}
                onClose={handleClose}
                subRecordMappingId={
                  selectedMapping && selectedMapping !== '__parent'
                    ? selectedMapping
                    : ''
                }
              />
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
