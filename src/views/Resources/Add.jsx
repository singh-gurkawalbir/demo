// import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import ResourceForm from '../../components/ResourceFormFactory';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../constants/resource';
// import useEnqueueSnackbar from '../../hooks/enqueueSnackbar';

const styles = () => ({});

function Add(props) {
  const { match } = props;
  const { id, resourceType } = match.params;
  const dispatch = useDispatch();

  function handleSubmitComplete() {
    props.history.push(`/pg/resources/exports/edit/${id}`);
    dispatch(actions.resourceForm.clear(resourceType, id));
    // dispatch(actions.resource.patch(resourceType, id));
  }

  return (
    <div key={id}>
      <Typography variant="h5">
        New {`${RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]}`}
      </Typography>

      <LoadResources required resources={[resourceType]}>
        <ResourceForm
          key={id}
          resourceType={resourceType}
          resourceId={id}
          isNew
          onSubmitComplete={handleSubmitComplete}
        />
      </LoadResources>
    </div>
  );
}

export default withStyles(styles)(Add);
