import { useSelector } from 'react-redux';
import { Typography, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import LoadResources from '../../components/LoadResources';
import ResourceForm from '../../components/ResourceFormFactory';
import { MODEL_PLURAL_TO_LABEL } from '../../utils/resource';
import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';
import * as selectors from '../../reducers';

const styles = theme => ({
  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing.triple,
  },
  paper: {
    padding: theme.spacing.double,
  },
});

function StandaloneResource(props) {
  const { match, classes } = props;
  const { id, resourceType, operation } = match.params;
  const isNew = operation === 'add';
  const newResourceId = useSelector(state =>
    selectors.createdResourceId(state, id)
  );
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const resourceLabel = MODEL_PLURAL_TO_LABEL[resourceType];

  // once a new resource (id.startsWith('new-')), has been committed,
  // we need to redirect to the resource using the correct id from
  // the persistence layer...
  if (newResourceId) {
    props.history.replace(`/pg/${resourceType}/edit/${newResourceId}`);
  }

  function handleSubmitComplete() {
    enqueueSnackbar({
      message: `${resourceLabel} ${isNew ? `Created` : 'Updated'}`,
      variant: 'success',
    });

    if (isNew) {
      props.history.replace(`/pg/${resourceType}/edit/${id}`);
    }
  }

  const submitButtonLabel =
    isNew && ['imports', 'exports', 'connections'].includes(resourceType)
      ? 'Next'
      : 'Save';

  return (
    <main className={classes.content}>
      <Paper className={classes.paper}>
        <Typography variant="h5">
          {isNew ? `Create` : 'Edit'} {resourceLabel}
        </Typography>

        <LoadResources required resources={resourceType}>
          <ResourceForm
            key={`${isNew}-${id}`}
            isNew={isNew}
            resourceType={resourceType}
            resourceId={id}
            submitButtonLabel={submitButtonLabel}
            onSubmitComplete={handleSubmitComplete}
            cancelButtonLabel="Back"
            onCancel={() => props.history.goBack()}
          />
        </LoadResources>
      </Paper>
    </main>
  );
}

export default withStyles(styles)(StandaloneResource);
