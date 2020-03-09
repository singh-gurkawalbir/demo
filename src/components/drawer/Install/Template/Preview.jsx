import { Fragment, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { makeStyles, Grid, Typography, Button } from '@material-ui/core';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import ApplicationImg from '../../../icons/ApplicationImg';
import useConfirmDialog from '../../../ConfirmDialog';
import templateUtil from '../../../../utils/template';
import PreviewTable from '../common/PreviewTable';

const useStyles = makeStyles(theme => ({
  templateBody: {
    padding: '15px',
  },
  appDetails: {
    paddingLeft: '25px',
  },
  marketplaceContainer: {
    maxWidth: '90vw',
    padding: '0 15px',
  },
  appDetailsHeader: {
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,
    marginBottom: '5px',
  },
  paper: {
    padding: theme.spacing(1, 2),
    background: theme.palette.background.default,
  },
  templateBoxHead: {
    padding: '10px 0',
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  installButton: {
    paddingTop: '20px',
  },
  description: {
    paddingBottom: '20px',
  },
  componentsTable: {
    paddingTop: '20px',
    borderTop: `solid 1px ${theme.palette.secondary.lightest}`,
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
  const components = useSelector(state =>
    selectors.previewTemplate(state, templateId)
  );

  useEffect(() => {
    if (!template) {
      dispatch(actions.marketplace.requestTemplates());
    }
  }, [dispatch, template]);
  useEffect(() => {
    if (!components || (isEmpty(components) && !requested)) {
      dispatch(actions.template.requestPreview(templateId));
      setRequested(true);
    }
  }, [components, dispatch, requested, templateId]);

  if (!template) {
    return <Typography>Loading Template...</Typography>;
  }

  const { name, description, user } = template;
  const { name: username, company } = user || {};
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
    if (template._connectorId) {
      installTemplate();

      return;
    }

    confirmDialog({
      title: 'Disclaimer',
      message: `Please note that by default all integration flows will be disabled when first installed, and that you will need to explicitly enable each flow that you want to use. Please note also that you can modify, delete, or extend any of the components that get installed, and unlike Integration apps, updates to the master integration template will never be propagated automatically to your account. Lastly, please note that integration templates are not explicitly reviewed by Celigo, and please be sure to review all components in the integration before proceeding.`,
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Proceed',
          onClick: installTemplate,
        },
      ],
    });
  };

  return (
    <div className={classes.marketplaceBox}>
      <div className={classes.mpExplore}>
        <Fragment>
          <div className={classes.templateBoxHead}>
            <div className={classes.marketplaceContainer}>
              <ApplicationImg size="large" type={template.applications[0]} />
              {template.applications[1] && (
                <ApplicationImg size="large" type={template.applications[1]} />
              )}

              <Typography variant="h2">{name}</Typography>
            </div>
          </div>
          <div className={classes.templateBody}>
            <div className="container">
              <Grid container>
                <Grid item xs={9}>
                  <Typography variant="body1" className={classes.description}>
                    {description}
                  </Typography>
                  <Typography
                    variant="body2"
                    className={classes.componentsTable}>
                    The following components will be created in your account.
                  </Typography>

                  <PreviewTable templateId={templateId} />

                  <div align="right" className={classes.installButton}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleInstallIntegration}>
                      Install Integration
                    </Button>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div className={classes.appDetails}>
                    <div className={classes.appDetailsHeader}>
                      <Typography variant="h4">App Details</Typography>
                    </div>
                    <div className="app-details">
                      <Typography>{`Author : ${username}`}</Typography>
                      <Typography>{`Company : ${company}`}</Typography>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
