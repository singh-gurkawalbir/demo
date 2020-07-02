import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import useConfirmDialog from '../../../ConfirmDialog';
import templateUtil from '../../../../utils/template';
import PreviewTable from '../common/PreviewTable';

const useStyles = makeStyles(theme => ({
  installButton: {
    marginTop: theme.spacing(2),
  },
  preview: {
    marginTop: theme.spacing(2),
    overflowY: 'auto',
    maxHeight: `calc(100vh - ${theme.appBarHeight + 185}px)`,
  },
}));

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
      message: 'Please note that by default all integration flows will be disabled when first installed, and that you will need to explicitly enable each flow that you want to use. Please note also that you can modify, delete, or extend any of the components that get installed, and unlike Integration apps, updates to the master integration template will never be propagated automatically to your account. Lastly, please note that integration templates are not explicitly reviewed by Celigo, and please be sure to review all components in the integration before proceeding.',
      buttons: [
        {
          label: 'Proceed',
          onClick: installTemplate,
        },
        {
          label: 'Cancel',
          color: 'secondary',
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

      <div className={classes.preview}>
        <PreviewTable templateId={templateId} />
      </div>

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
