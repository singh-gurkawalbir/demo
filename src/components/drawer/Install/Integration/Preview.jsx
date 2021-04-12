import React, { useEffect} from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import useConfirmDialog from '../../../ConfirmDialog';
import PreviewTable from '../common/PreviewTable';
import getRoutePath from '../../../../utils/routePaths';

const emptyObject = {};

const useStyles = makeStyles(theme => ({
  installButton: {
    marginTop: theme.spacing(2),
  },
  preview: {
    marginTop: theme.spacing(2),
    overflowY: 'auto',
    maxHeight: `calc(100vh - ${theme.appBarHeight + 225}px)`,
  },
}));

export default function IntegrationPreview() {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { templateId } = match.params;
  const { confirmDialog } = useConfirmDialog();
  const dispatch = useDispatch();

  const { runKey } = useSelector(
    state => selectors.templateSetup(state, templateId) || emptyObject
  );
  const { isCloned, integrationId} = useSelector(
    state => {
      const { isCloned, integrationId} = selectors.integrationClonedDetails(state, templateId);

      return { isCloned, integrationId};
    },
    shallowEqual
  );

  useEffect(() => {
    if (isCloned) {
      history.push(
        getRoutePath(
          `/integrations/${integrationId}/setup`
        )
      );
    }
    dispatch(
      actions.integrationApp.clone.clearIntegrationClonedStatus(templateId)
    );
  }, [dispatch, integrationId, templateId, isCloned, history]);
  const installTemplate = () => {
    dispatch(actions.template.createComponents(templateId, runKey));
  };

  const handleInstallIntegration = () => {
    confirmDialog({
      title: 'Disclaimer',
      message: 'By default, all integration flows will be disabled when first installed; you must enable each flow that you want to run. You can modify, delete, or extend any of the resources in this integration, but  updates to the original integration will not affect this new copy. This integration has not been reviewed by Celigo. Make sure you trust the author before installing, and carefully review all components in the integration before proceeding.',
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
        variant="outlined"
        color="primary"
        onClick={handleInstallIntegration}>
        Install integration
      </Button>
    </div>
  );
}
