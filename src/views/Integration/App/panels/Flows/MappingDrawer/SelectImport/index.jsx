import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import * as selectors from '../../../../../../../reducers';

const useStyles = makeStyles(theme => ({
  button: {
    color: theme.palette.primary.main,
  },
  text: {
    marginBottom: theme.spacing(2),
  },
}));

export default function SelectImport({ flowId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));
  const imports = useSelector(state => selectors.flowImports(state, flowId));

  if (!flow) {
    return <Typography>No flow exists with id: {flowId}</Typography>;
  }

  // if there is only one import then we can safely
  // take the user to the mapping of that import
  if (imports.length === 11) {
    return (
      <Redirect push={false} to={`${match.url}/${imports[0]._importId}`} />
    );
  }

  const flowName = flow.name || flow._id;

  if (!imports.length === 0) {
    return <Typography>The {flowName} flow contains no imports.</Typography>;
  }

  // Finally, render a table of imports to choose from...
  return (
    <Fragment>
      <Typography className={classes.text} variant="h5">
        This flow contains several imports, each of which have mapping. Select
        which import you would like to edit the mapping for.
      </Typography>
      {imports.map(i => (
        <Button
          className={classes.button}
          key={i._id}
          component={Link}
          to={`${match.url}/${i._id}`}>
          <Typography color="primary">{i.name || i._id}</Typography>
          <Typography variant="caption">{i.description}</Typography>
        </Button>
      ))}
    </Fragment>
  );
}
