import React, { useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles, Divider, Typography, Button } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import ApplicationImg from '../../../icons/ApplicationImg';
import useConfirmDialog from '../../../ConfirmDialog';
import PreviewTable from '../common/PreviewTable';
import AddIcon from '../../../icons/AddIcon';
import getRoutePath from '../../../../utils/routePaths';
import messageStore from '../../../../constants/messages';

const useStyles = makeStyles(theme => ({
  container: {
    overflow: 'auto',
    margin: theme.spacing(2, 0, 2, 2),
    display: 'grid',
    gridTemplateColumns: '33% 66%',
    gridTemplateRows: 'auto',
    height: `calc(100vh - ${theme.appBarHeight + 192}px)`,
    gridColumnGap: '1%',
  },
  appDetails: {
    background: theme.palette.background.paper2,
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'flex-start',
    wordBreak: 'break-word',
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    borderRadius: theme.spacing(0.5),
  },
  componentPreview: {
    padding: theme.spacing(2.5, 2),
    overflowY: 'auto',
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    background: theme.palette.background.paper,
  },
  appLogosContainer: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    height: 160,
    top: theme.spacing(-2),
    backgroundImage: 'url(https://www.celigo.com/wp-content/themes/Avada-Child-Theme/images/blue-bg.svg)',
    backgroundSize: 'cover',
    backgroundPosition: 'right top',
    backgroundRepeat: 'no-repeat',
    padding: theme.spacing(0, 4),

  },
  applogos: {
    background: theme.palette.background.paper,
    borderRadius: theme.spacing(0.5),
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
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
  appsTitle: {
    color: theme.palette.common.white,
    paddingLeft: theme.spacing(2),
  },
  componentPreviewHeading: {
    paddingBottom: theme.spacing(3),
  },
  listItem: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridColumnGap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  keyName: {
    fontSize: 15,
  },
}));
const emptyObject = {};

export default function TemplatePreview() {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { templateId } = match.params;
  const dispatch = useDispatch();
  const { confirmDialog } = useConfirmDialog();
  const template = useSelector(state =>
    selectors.marketplaceTemplateById(state, templateId)
  );
  const { components: origComponents, status} =
    useSelector(state => selectors.previewTemplate(state, templateId)) || {};
  const { objects: components } = origComponents || {};
  const { runKey } = useSelector(
    state => selectors.templateSetup(state, templateId) || emptyObject
  );
  const { isCloned, integrationId} = useSelector(
    state => selectors.integrationClonedDetails(state, templateId),
    (left, right) =>
      left &&
      right &&
      left.isCloned === right.isCloned &&
      left.integrationId === right.integrationId
  );

  useEffect(() => {
    if (isCloned) {
      history.push(
        getRoutePath(
          `/integrations/${integrationId}/setup`
        )
      );
      dispatch(
        actions.integrationApp.clone.clearIntegrationClonedStatus(templateId)
      );
    }
  }, [dispatch, integrationId, templateId, isCloned, history]);

  useEffect(() => {
    if (!template) {
      dispatch(actions.marketplace.requestTemplates());
    }
  }, [dispatch, template]);
  useEffect(() => {
    if (!components) {
      dispatch(actions.template.requestPreview(templateId));
    }
  }, [components, dispatch, templateId]);

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
    dispatch(actions.template.createComponents(templateId, runKey));
  };

  const handleReadMeClick = () => {
    confirmDialog({
      title: 'Readme',
      isHtml: true,
      message: integration.doc.readme,
      buttons: [
        {
          label: 'Ok',
        },
      ],
    });
  };

  const isStaging = process?.env.API_ENDPOINT === 'https://staging.integrator.io';
  const getMessageForTemplate = () => {
    if ((template?.user.company === 'Celigo') || (isStaging && template?.user.company === 'Celigo - Templates Team')) {
      return messageStore('CELIGO_AUTHORED_TEMPLATE_DISCLAIMER');
    }

    return messageStore('THIRD_PARTY_TEMPLATE_DISCLAIMER');
  };

  const handleInstallIntegration = () => {
    if (template._connectorId) {
      installTemplate();

      return;
    }

    confirmDialog({
      title: 'Disclaimer',
      message: getMessageForTemplate(),
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
      <div data-public className={classes.appLogosContainer}>
        <div className={classes.applogos}>
          <ApplicationImg markOnly size="small" type={template.applications[0]} />
          {template.applications[1] && (
          <>
            <AddIcon className={classes.plusIcon} />
            <ApplicationImg
              markOnly
              size="medium"
              type={template.applications[1]}
            />
          </>
          )}
        </div>
        <Typography data-public variant="h3" className={classes.appsTitle}>{name}</Typography>
      </div>

      <div data-public className={classes.container}>
        <div className={classes.appDetails}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleInstallIntegration}>
            Install now
          </Button>
          <br />
          {hasReadMe && (
            <Button
              color="secondary"
              variant="outlined"
              onClick={handleReadMeClick}>
              View Readme
            </Button>
          )}
          <Divider variant="middle" className={classes.divider} />
          <Typography>{description}</Typography>

          <Divider variant="middle" className={classes.divider} />
          <div className={classes.listItem}>
            <Typography variant="h4" className={classes.keyName}>Created by: </Typography>
            <Typography>{username}</Typography>
          </div>
          <div className={classes.listItem}>
            <Typography variant="h4" className={classes.keyName}>Company: </Typography>
            <Typography>{company}</Typography>
          </div>

        </div>
        <div className={classes.componentPreview}>
          {status === 'failure' ? null : (
            <>
              <Typography variant="h4" className={classes.componentPreviewHeading}>
                Components
              </Typography>
              <Typography variant="body2" >
                The following components will be created in your account.
              </Typography>

              <PreviewTable templateId={templateId} />
            </>
          )}

        </div>
      </div>
    </>
  );
}
