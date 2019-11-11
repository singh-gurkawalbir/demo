import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import { Fragment, useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { Grid, Typography, Button } from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';
import CeligoTable from '../../components/CeligoTable';
import { MODEL_PLURAL_TO_LABEL } from '../../utils/resource';
import templateUtil from '../../utils/template';
import LoadResources from '../../components/LoadResources';
import RadioGroup from '../../components/DynaForm/fields/DynaRadioGroup';
import DynaSelect from '../../components/DynaForm/fields/DynaSelect';
import DynaText from '../../components/DynaForm/fields/DynaText';
import getRoutePath from '../../utils/routePaths';

const useStyles = makeStyles(theme => ({
  root: {
    marginLeft: theme.spacing(1),
  },
  templateBody: {
    padding: '15px',
  },
  appDetails: {
    paddingTop: '25px',
  },
  marketplaceContainer: {
    maxWidth: '90vw',
    padding: '0 15px',
  },
  appDetailsHeader: {
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,
    marginBottom: '5px',
  },
  container: {
    borderTop: `solid 1px ${theme.palette.secondary.lightest}`,
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
  nameField: {
    marginBottom: '10px',
  },
  componentPadding: {
    padding: '25px 25px 0 25px',
  },
  componentsTable: {
    paddingTop: '20px',
  },
}));

export default function ClonePreview(props) {
  const classes = useStyles(props);
  const { resourceType, resourceId } = props.match.params;
  const [requested, setRequested] = useState(false);
  const dispatch = useDispatch();
  const preferences = useSelector(state => selectors.userPreferences(state));
  const [environmentState, setEnvironmentState] = useState(
    preferences.environment
  );
  const showIntegrationField = resourceType === 'flows';
  const [integrationState, setIntegrationState] = useState(null);
  const resource = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)
  );
  const { createdComponents } =
    useSelector(state =>
      selectors.cloneData(state, resourceType, resourceId)
    ) || {};
  const [nameState, setNameState] = useState(
    resource ? `Clone - ${resource.name}` : ''
  );
  const integrations = useSelector(state =>
    selectors
      .resourceList(state, {
        type: 'integrations',
        ignoreEnvironmentFilter: true,
      })
      .resources.filter(i => !!i.sandbox === (environmentState === 'sandbox'))
  );
  const components = useSelector(state =>
    selectors.clonePreview(state, resourceType, resourceId)
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

  useEffect(() => {
    if (!resource) {
      dispatch(actions.resource.request(resourceType, resourceId));
    }
  }, [dispatch, resource, resourceId, resourceType]);
  useEffect(() => {
    if (!components || (isEmpty(components) && !requested)) {
      dispatch(actions.clone.requestPreview(resourceType, resourceId));
      setRequested(true);
    }
  }, [components, dispatch, requested, resourceId, resourceType]);
  useEffect(() => {
    if (createdComponents) {
      dispatch(actions.clone.clearData(resourceType, resourceId));
      dispatch(actions.resource.requestCollection('integrations'));
      dispatch(actions.resource.requestCollection('flows'));
      dispatch(actions.resource.requestCollection('connections'));
      dispatch(actions.resource.requestCollection('exports'));
      dispatch(actions.resource.requestCollection('imports'));
      dispatch(actions.resource.requestCollection('stacks'));

      if (['integrations', 'flows'].includes(resourceType)) {
        // redirect to integration Settings
        const integration = createdComponents.find(
          c => c.model === 'Integration'
        );

        if (integration) {
          props.history.push(
            getRoutePath(`/integrations/${integration._id}/settings/flows`)
          );
        } else {
          props.history.push('/');
        }
      } else {
        props.history.push(getRoutePath(`/${resourceType}`));
      }
    }
  }, [createdComponents, dispatch, props.history, resourceId, resourceType]);

  if (!components || isEmpty(components)) {
    return <Typography>Loading Clone Preview...</Typography>;
  }

  const handleNameChange = (id, val) => {
    setNameState(val);
  };

  const handleEnvironmentChange = (id, val) => {
    setEnvironmentState(val);
  };

  const handleIntegrationChange = (id, val) => {
    setIntegrationState(val);
  };

  const { description } = resource;
  const { objects = [] } = components;
  const clone = () => {
    const { installSteps, connectionMap } =
      templateUtil.getInstallSteps(components) || {};

    if (showIntegrationField && !integrationState) {
      return false;
    }

    if (installSteps && installSteps.length) {
      dispatch(
        actions.clone.installStepsReceived(
          installSteps,
          connectionMap,
          {
            name: nameState,
            sandbox: environmentState === 'sandbox',
            _integrationId: integrationState,
          },
          resourceType,
          resourceId
        )
      );
      props.history.push(`/pg/clone/${resourceType}/${resourceId}/setup`);
    } else {
      dispatch(
        actions.clone.installStepsReceived(
          [],
          {},
          {
            name: nameState,
            sandbox: environmentState === 'sandbox',
            _integrationId: integrationState,
          },
          resourceType,
          resourceId
        )
      );
      dispatch(actions.clone.createComponents(resourceType, resourceId));
    }
  };

  return (
    <LoadResources resources="integrations" required>
      <div className={classes.marketplaceBox}>
        <div className={classes.mpExplore}>
          <Fragment>
            <div className={classes.templateBody}>
              <div>
                <Typography variant="h3">Cloning</Typography>
              </div>
              <div className={classes.container}>
                <Grid container>
                  <Grid item xs={3}>
                    <div className={classes.appDetails}>
                      <div className="app-details">
                        <Typography>
                          Cloning can be used to create a copy of a flow,
                          export, import, orchestration, or an entire
                          integration. Cloning is useful for testing changes
                          without affecting your production integrations (i.e.
                          when you clone something you can choose a different
                          set of connection records). Cloning supports both
                          sandbox and production environments.{' '}
                        </Typography>
                      </div>
                    </div>
                  </Grid>
                  <Grid className={classes.componentPadding} item xs={9}>
                    <div className={classes.nameField}>
                      <DynaText
                        id="name"
                        label="Name"
                        required={false}
                        onFieldChange={handleNameChange}
                        value={nameState}
                      />
                    </div>
                    <RadioGroup
                      value={environmentState}
                      id="environment"
                      label="Environment"
                      required={false}
                      onFieldChange={handleEnvironmentChange}
                      options={[
                        {
                          items: [
                            { label: `Production`, value: 'production' },
                            { label: `Sandbox`, value: 'sandbox' },
                          ],
                        },
                      ]}
                    />
                    {showIntegrationField && (
                      <DynaSelect
                        label="Integration"
                        name="integration"
                        required={false}
                        onFieldChange={handleIntegrationChange}
                        value={integrationState}
                        options={[
                          {
                            items: integrations.map(i => ({
                              label: i.name,
                              value: i._id,
                            })),
                          },
                        ]}
                      />
                    )}
                    {description && (
                      <Typography
                        variant="body1"
                        className={classes.description}>
                        {description}
                      </Typography>
                    )}
                    <Typography
                      variant="body2"
                      className={classes.componentsTable}>
                      {`The following components will get cloned with this ${MODEL_PLURAL_TO_LABEL[resourceType]}.`}
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
                        onClick={clone}>
                        {`Clone ${MODEL_PLURAL_TO_LABEL[resourceType]}`}
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </Fragment>
        </div>
      </div>
    </LoadResources>
  );
}
