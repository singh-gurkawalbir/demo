import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Fragment } from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';
import CeligoTable from '../../components/CeligoTable';
import { confirmDialog } from '../../components/ConfirmDialog';
import templateUtil from '../../utils/template';

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: theme.spacing(1),
  },
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

export default function TemplatePreview(props) {
  const classes = useStyles(props);
  const { templateId } = props.match.params;
  const dispatch = useDispatch();
  const components = useSelector(state =>
    selectors.previewTemplate(state, templateId)
  );
  const columns = [
    {
      heading: 'Name',
      value: r => r.doc.name,
      orderBy: 'name',
    },
    { heading: 'Type', value: r => r.model },
    { heading: 'Description', value: r => r.doc.description },
  ];
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
      props.history.push(`/pg/templates/${templateId}/setup`);
    } else {
      dispatch(actions.template.createComponents(templateId));
    }
  };

  const handleInstallIntegration = () => {
    confirmDialog({
      title: 'Disclaimer',
      message: `Please note that by default all integration flows will be disabled when first installed, and that you will need to explicitly enable each flow that you want to use. Please note also that you can modify, delete, or extend any of the components that get installed, and unlike SmartConnectors, updates to the master integration template will never be propagated automatically to your account. Lastly, please note that integration templates are not explicitly reviewed by Celigo, and please be sure to review all components in the integration before proceeding.`,
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
    <div className={classes.marketplaceBox}>
      <div className={classes.mpExplore}>
        <Fragment>
          <div className={classes.templateBody}>
            <div className="container">
              <Grid container>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    className={classes.componentsTable}>
                    The following components will be created in your account.
                  </Typography>
                  {!!objects.length && (
                    <CeligoTable
                      data={objects.map((obj, index) => ({
                        ...obj,
                        _id: index,
                      }))}
                      columns={columns}
                    />
                  )}
                  {!objects.length && (
                    <Typography variant="h4">
                      Loading Preview Components
                    </Typography>
                  )}
                  <div align="right" className={classes.installButton}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleInstallIntegration}>
                      Install Integration
                    </Button>
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
