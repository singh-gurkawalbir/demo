import { Route } from 'react-router-dom';
import { Fragment } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import LoadResources from '../../../components/LoadResources';
import ResourceForm from '../../../components/ResourceFormFactory';
import { MODEL_PLURAL_TO_LABEL } from '../../../utils/resource';

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: props => props.zIndex,
    border: 'solid 1px',
    borderColor: 'rgb(0,0,0,0.3)',
    borderLeft: 0,
    height: '100vh',
    width: props => (props.match.isExact ? 400 : 150),
    overflowX: 'hidden',
    overflowY: props => (props.match.isExact ? 'auto' : 'hidden'),
    padding: theme.spacing(2, 2, 0, 2),
    boxShadow: `-5px 0 8px rgba(0,0,0,0.2)`,
  },
  form: {
    height: `calc(100vh - 136px)`,
    width: props => (props.match.isExact ? undefined : 400),
    maxHeight: 'unset',
    marginTop: theme.spacing(1),
  },
}));

export default function Panel(props) {
  const classes = useStyles(props);
  const { match, onClose, zIndex } = props;
  const { id, resourceType, operation } = match.params;
  const isNew = operation === 'add';

  return (
    <Fragment>
      <div className={classes.root}>
        <Typography variant="h4">
          {MODEL_PLURAL_TO_LABEL[resourceType]}
        </Typography>
        <LoadResources required resources={resourceType}>
          <ResourceForm
            variant={match.isExact ? 'edit' : 'view'}
            key={`${isNew}-${id}`}
            isNew={isNew}
            resourceType={resourceType}
            resourceId={id}
            onSubmitComplete={onClose}
            onCancel={onClose}
            submitButtonLabel="Save"
            cancelButtonLabel="Cancel"
            className={classes.form}
          />
        </LoadResources>
      </div>

      <Route
        path={`${match.url}/edit/:resourceType/:id`}
        render={props => (
          <Panel {...props} zIndex={zIndex + 1} onClose={onClose} />
        )}
      />
    </Fragment>
  );
}
