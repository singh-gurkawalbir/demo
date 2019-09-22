import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { makeStyles, Typography } from '@material-ui/core';
import LoadResources from '../../../components/LoadResources';
import ResourceForm from '../../../components/ResourceFormFactory';
import { MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import * as selectors from '../../../reducers';

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: props => props.zIndex,
    border: 'solid 1px',
    borderColor: 'rgb(0,0,0,0.2)',
    borderLeft: 0,
    height: '100vh',
    width: props => (props.match.isExact ? 450 : 150),
    overflowX: 'hidden',
    overflowY: props => (props.match.isExact ? 'auto' : 'hidden'),
    padding: theme.spacing(2, 0, 0, 0),
    boxShadow: `-5px 0 8px rgba(0,0,0,0.2)`,
  },
  form: {
    height: `calc(100vh - 136px)`,
    width: props => (props.match.isExact ? undefined : 400),
    maxHeight: 'unset',
    marginTop: theme.spacing(1),
  },
  title: {
    padding: theme.spacing(0, 0, 0, 3),
  },
}));

export default function Panel(props) {
  const { match, location, onClose, zIndex } = props;
  const { id, resourceType, operation } = match.params;
  const isNew = operation === 'add';
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const newResourceId = useSelector(state =>
    selectors.createdResourceId(state, id)
  );
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const resourceLabel = MODEL_PLURAL_TO_LABEL[resourceType];
  const getEditUrl = id => {
    // console.log(location);
    const segments = location.pathname.split('/');
    const { length } = segments;

    segments[length - 1] = id;
    segments[length - 3] = 'edit';

    const url = segments.join('/');

    return url;
  };

  useEffect(() => {
    // once a new resource (id.startsWith('new-')), has been committed,
    // we need to redirect to the resource using the correct id from
    // the persistence layer...
    if (newResourceId) {
      enqueueSnackbar({
        message: `${resourceLabel} created`,
        variant: 'success',
      });

      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, newResourceId]);

  function handleSubmitComplete() {
    if (isNew) {
      props.history.replace(getEditUrl(id));
    }
  }

  const submitButtonLabel =
    isNew && ['imports', 'exports', 'connections'].includes(resourceType)
      ? 'Next'
      : 'Save';

  return (
    <Fragment>
      <div className={classes.root}>
        <Typography variant="h5" className={classes.title}>
          {isNew ? `Create` : 'Edit'} {resourceLabel}
        </Typography>
        <LoadResources required resources={resourceType}>
          <ResourceForm
            className={classes.form}
            variant={match.isExact ? 'edit' : 'view'}
            key={`${isNew}-${id}`}
            isNew={isNew}
            resourceType={resourceType}
            resourceId={id}
            cancelButtonLabel="Cancel"
            submitButtonLabel={submitButtonLabel}
            onSubmitComplete={handleSubmitComplete}
            onCancel={onClose}
          />
        </LoadResources>
      </div>

      <Route
        path={`${match.url}/:operation/:resourceType/:id`}
        render={props => (
          <Panel {...props} zIndex={zIndex + 1} onClose={onClose} />
        )}
      />
    </Fragment>
  );
}
