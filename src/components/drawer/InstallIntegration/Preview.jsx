import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import CeligoTable from '../../CeligoTable';
import useConfirmDialog from '../../ConfirmDialog';
import templateUtil from '../../../utils/template';
import Spinner from '../../Spinner';

const useStyles = makeStyles(theme => ({
  tableContainer: {
    maxHeight: `calc(100vh - ${theme.appBarHeight + 175}px)`,
    overflowY: 'auto',
  },
  installButton: {
    marginTop: theme.spacing(2),
  },
}));
const columns = [
  {
    heading: 'Name',
    value: r => r.doc.name,
    orderBy: 'name',
  },
  { heading: 'Type', value: r => r.model },
  { heading: 'Description', value: r => r.doc.description },
];

export default function IntegrationPreview() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const { templateId } = match.params;
  const { confirmDialog } = useConfirmDialog();
  const dispatch = useDispatch();
  const components = useSelector(state =>
    selectors.previewTemplate(state, templateId)
  );
  const { objects = [] } = components;
  const installTemplate = () => {
    const { installSteps, connectionMap } =
      templateUtil.getInstallSteps(components) || {};

    if (installSteps && installSteps.length) {
      dispatch(
        actions.template.installStepsReceived(
          installSteps,
          connectionMap,
          templateId
        )
      );
      history.push(location.pathname.replace('/preview/', '/setup/'));
    } else {
      dispatch(actions.template.createComponents(templateId));
    }
  };

  const handleInstallIntegration = () => {
    confirmDialog({
      title: 'Disclaimer',
      message: `Please note that by default all integration flows will be disabled when first installed, and that you will need to explicitly enable each flow that you want to use. Please note also that you can modify, delete, or extend any of the components that get installed, and unlike Integration apps, updates to the master integration template will never be propagated automatically to your account. Lastly, please note that integration templates are not explicitly reviewed by Celigo, and please be sure to review all components in the integration before proceeding.`,
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Proceed',
          onClick: () => {
            installTemplate();
          },
        },
      ],
    });
  };

  return (
    <div>
      <Typography variant="h4">Preview</Typography>
      <Typography>
        The following components are created with this integration:
      </Typography>
      {!!objects.length && (
        <div className={classes.tableContainer}>
          <CeligoTable
            data={objects.map((obj, index) => ({
              ...obj,
              _id: index,
            }))}
            columns={columns}
          />
        </div>
      )}
      {!objects.length && (
        <div>
          <Typography variant="h4">Loading preview...</Typography>
          <Spinner />
        </div>
      )}
      <Button
        className={classes.installButton}
        variant="contained"
        color="primary"
        onClick={handleInstallIntegration}>
        Install integration
      </Button>
    </div>
  );
}
