import React, { useEffect} from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Typography} from '@mui/material';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import useConfirmDialog from '../../../ConfirmDialog';
import PreviewTable from '../common/PreviewTable';
import getRoutePath from '../../../../utils/routePaths';
import { message } from '../../../../utils/messageStore';
import FilledButton from '../../../Buttons/FilledButton';

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
      message: message.DISCLAIMER.DIY_INSTALL_DISCLAIMER,
      buttons: [
        {
          label: 'Proceed',
          onClick: installTemplate,
        },
        {
          label: 'Cancel',
          variant: 'text',
        },
      ],
    });
  };

  return (
    <div>
      <Typography variant="h4">Preview</Typography>
      <Typography>
        {message.COMPONENT_INFO}
      </Typography>

      <div className={classes.preview}>
        <PreviewTable templateId={templateId} />
      </div>

      <FilledButton
        className={classes.installButton}
        onClick={handleInstallIntegration}>
        Install integration
      </FilledButton>
    </div>
  );
}
