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
  componentPadding: {
    padding: '0 25px 0 25px',
  },
  componentsTable: {
    paddingTop: '20px',
    // borderTop: `solid 1px ${theme.palette.secondary.lightest}`,
  },
}));

export default function TemplatePreview(props) {
  const classes = useStyles(props);
  const { resourceType, resourceId } = props.match.params;
  const [requested, setRequested] = useState(false);
  const dispatch = useDispatch();
  const resource = useSelector(state =>
    selectors.resource(state, resourceType, resourceId)
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

  if (!components || isEmpty(components)) {
    return <Typography>Loading Clone Preview...</Typography>;
  }

  const { description } = resource;
  const { objects = [] } = components;
  const clone = () => {
    const { installSteps, connectionMap } =
      templateUtil.getInstallSteps(components) || {};

    if (installSteps && installSteps.length) {
      dispatch(
        actions.clone.installStepsReceived(
          installSteps,
          connectionMap,
          resourceType,
          resourceId
        )
      );
      props.history.push(`/pg/clone/${resourceType}/${resourceId}/setup`);
    } else {
      dispatch(actions.clone.createComponents(resourceType, resourceId));
    }
  };

  return (
    <div className={classes.marketplaceBox}>
      <div className={classes.mpExplore}>
        <Fragment>
          <div className={classes.templateBody}>
            <div>
              <Typography variant="h2">Cloning</Typography>
            </div>
            <div className={classes.container}>
              <Grid container>
                <Grid item xs={3}>
                  <div className={classes.appDetails}>
                    <div className="app-details">
                      <Typography>
                        Cloning can be used to create a copy of a flow, export,
                        import, orchestration, or an entire integration. Cloning
                        is useful for testing changes without affecting your
                        production integrations (i.e. when you clone something
                        you can choose a different set of connection records).
                        Cloning supports both sandbox and production
                        environments.{' '}
                      </Typography>
                    </div>
                  </div>
                </Grid>
                <Grid className={classes.componentPadding} item xs={9}>
                  <Typography variant="body1" className={classes.description}>
                    {description}
                  </Typography>
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
                    <Button variant="contained" color="primary" onClick={clone}>
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
  );
}
