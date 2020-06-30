import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { makeStyles, Divider, Typography, Button } from '@material-ui/core';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import ApplicationImg from '../../../icons/ApplicationImg';
import useConfirmDialog from '../../../ConfirmDialog';
import templateUtil from '../../../../utils/template';
import PreviewTable from '../common/PreviewTable';
import AddIcon from '../../../icons/AddIcon';

const useStyles = makeStyles(theme => ({
  container: {
    overflow: 'auto',
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    margin: theme.spacing(2, 0),
    backgroundColor: theme.palette.background.paper,
    display: 'grid',
    gridTemplateColumns: '1fr 4fr',
    gridTemplateRows: 'auto',
    height: `calc(100vh - ${theme.appBarHeight + 192}px)`,
  },
  appDetails: {
    borderRight: `solid 1px ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
  },
  componentPreview: {
    padding: theme.spacing(2),
    overflowY: 'auto',
  },
  appLogos: {
    display: 'flex',
    alignItems: 'center',
  },
  appDetailsHeader: {
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,
    marginBottom: theme.spacing(0.5),
  },

  divider: {
    margin: theme.spacing(2, 0),
  },
  plusIcon: {
    margin: theme.spacing(0, 1),
    color: theme.palette.text.hint,
  },
}));

export default function TemplatePreview() {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const { templateId } = match.params;
  const [requested, setRequested] = useState(false);
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const template = useSelector(state =>
    selectors.marketplaceTemplate(state, templateId)
  );
  const { objects: components, stackRequired } =
    useSelector(state => selectors.previewTemplate(state, templateId)) || {};

  useEffect(() => {
    if (!template) {
      dispatch(actions.marketplace.requestTemplates());
    }
  }, [dispatch, template]);
  useEffect(() => {
    if (!components || !requested) {
      dispatch(actions.template.requestPreview(templateId));
      setRequested(true);
    }
  }, [components, dispatch, requested, templateId]);

  if (!template) {
    return <Typography>Loading Template...</Typography>;
  }

  const integration =
    components && components.find(c => c.model === 'Integration');
  const hasReadMe = !!(
    integration &&
    integration.doc &&
    integration.doc.readme
  );
  const { name, description, user } = template;
  const { name: username, company } = user || {};
  const installTemplate = () => {
    const { installSteps, connectionMap } =
      templateUtil.getInstallSteps({ objects: components, stackRequired }) ||
      {};

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

  const handleReadMeClick = () => {
    confirmDialog({
      title: 'ReadMe',
      isHtml: true,
      message: integration.doc.readme,
      buttons: [
        {
          label: 'Ok',
        },
      ],
    });
  };

  const handleInstallIntegration = () => {
    if (template._connectorId) {
      installTemplate();

      return;
    }

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
    <>
      <div className={classes.appLogos}>
        <ApplicationImg markOnly size="small" type={template.applications[0]} />
        {template.applications[1] && (
          <>
            <AddIcon className={classes.plusIcon} />
            <ApplicationImg
              markOnly
              size="small"
              type={template.applications[1]}
            />
          </>
        )}
      </div>

      <Typography variant="h2">{name}</Typography>

      <div className={classes.container}>
        <div className={classes.appDetails}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleInstallIntegration}>
            Install now
          </Button>

          <Divider variant="middle" className={classes.divider} />

          <Typography>{description}</Typography>

          <Divider variant="middle" className={classes.divider} />

          <Typography>Created by: </Typography>
          <Typography>{username}</Typography>
          <br />
          <Typography>Company: </Typography>
          <Typography>{company}</Typography>
          <br />
          {hasReadMe && (
            <Button
              color="primary"
              variant="outlined"
              onClick={handleReadMeClick}>
              View ReadMe
            </Button>
          )}
        </div>

        <div className={classes.componentPreview}>
          <Typography variant="body2">
            The following components will be created in your account.
          </Typography>

          <PreviewTable templateId={templateId} />
        </div>
      </div>
    </>
  );
}
