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
import { ResourceFormFactory as DynaFromWithDynamicActions } from '../../components/ResourceFormFactory';
import { integrationSettingsToDynaFormMetadata } from '../../forms/utils';

const useStyles = makeStyles(theme => ({
  modalContent: {
    width: '70vw',
  },
  container: {
    marginTop: theme.spacing(1),
    overflowY: 'off',
  },
  header: {
    height: '100%',
    maxHeight: '28px',
  },
  root: {
    flexGrow: 1,
  },
  rowContainer: {
    display: 'flex',
    padding: '0px',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function IntegrationAppFlowSettings(props) {
  const classes = useStyles();
  const { onClose, settings, resource } = props;
  const { _integrationId } = resource;
  const translatedMeta = integrationSettingsToDynaFormMetadata(
    settings,
    _integrationId,
    true
  );
  const handleSubmitComplete = () => {
    // perform save operation only when mapping object is passed as parameter to the function.
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <LoadResources resources="imports">
      <Dialog fullScreen={false} open scroll="paper" maxWidth={false}>
        <IconButton
          aria-label="Close"
          data-test="closeImportMapping"
          className={classes.closeButton}
          onClick={handleCancel}>
          <CloseIcon />
        </IconButton>
        <DialogTitle disableTypography>
          <Typography variant="h6">Integration App Flow Settings</Typography>
        </DialogTitle>
        <DialogContent className={classes.modalContent}>
          <div className={classes.container}>
            <DynaFromWithDynamicActions
              editMode={false}
              resourceType="test-integrationId"
              onSubmitComplete={handleSubmitComplete}
              fieldMeta={translatedMeta}
            />
          </div>
        </DialogContent>
      </Dialog>
    </LoadResources>
  );
}
