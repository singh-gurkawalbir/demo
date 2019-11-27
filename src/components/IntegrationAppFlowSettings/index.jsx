import { makeStyles } from '@material-ui/core/styles';
import LoadResources from '../../components/LoadResources';
import DynaFormWithDynamicActions from '../../views/IntegrationApps/Settings/FlowSettingsForm';
import { integrationSettingsToDynaFormMetadata } from '../../forms/utils';
import ModalDialog from '../ModalDialog';

const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
    overflowY: 'off',
  },
}));

export default function IntegrationAppFlowSettings(props) {
  const classes = useStyles();
  const { onClose, settings, resource, storeId } = props;
  const { _integrationId } = resource;
  const translatedMeta = integrationSettingsToDynaFormMetadata(
    settings,
    _integrationId,
    true,
    { resource }
  );
  const handleCloseDialog = () => {
    onClose();
  };

  return (
    <LoadResources resources="imports,exports">
      <ModalDialog maxWidth="md" show onClose={handleCloseDialog}>
        <div>{`Flow Settings - ${resource.name}`}</div>
        <div>
          <div className={classes.container}>
            <DynaFormWithDynamicActions
              editMode={false}
              integrationId={_integrationId}
              flowId={resource._id}
              storeId={storeId}
              onSubmitComplete={handleCloseDialog}
              fieldMeta={translatedMeta}
            />
          </div>
        </div>
      </ModalDialog>
    </LoadResources>
  );
}
