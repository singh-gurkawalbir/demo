import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core';
import LoadResources from '../../components/LoadResources';
import CloseIcon from '../icons/CloseIcon';
import DynaFormWithDynamicActions from '../../views/IntegrationApps/Settings/FlowSettingsForm';
import { integrationSettingsToDynaFormMetadata } from '../../forms/utils';

const useStyles = makeStyles(theme => ({
  modalContent: {
    width: '70vw',
  },
  container: {
    marginTop: theme.spacing(1),
    overflowY: 'off',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function IntegrationAppFlowSettings(props) {
  const classes = useStyles();
  const { onClose, settings, resource, storeId } = props;
  const { _integrationId } = resource;
  const translatedMeta = integrationSettingsToDynaFormMetadata(
    settings,
    _integrationId,
    true
  );
  const handleCloseDialog = () => {
    onClose();
  };

  return (
    <LoadResources resources="imports,exports">
      <Dialog fullScreen={false} open scroll="paper" maxWidth={false}>
        <IconButton
          aria-label="Close"
          data-test="closeIAFlowSettings"
          className={classes.closeButton}
          onClick={handleCloseDialog}>
          <CloseIcon />
        </IconButton>
        <DialogTitle disableTypography>
          <Typography variant="h6">{`Flow Settings - ${resource.name}`}</Typography>
        </DialogTitle>
        <DialogContent className={classes.modalContent}>
          <div className={classes.container}>
            <DynaFormWithDynamicActions
              editMode={false}
              integrationId={_integrationId}
              flowId={resource._id}
              storeId={storeId}
              onSubmitComplete={handleCloseDialog}
              fieldMeta={translatedMeta}
              resourceType="integrations"
              resourceId={_integrationId}
            />
          </div>
        </DialogContent>
      </Dialog>
    </LoadResources>
  );
}
