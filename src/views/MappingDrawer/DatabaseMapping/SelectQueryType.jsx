import React, {Fragment, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import { selectors } from '../../../reducers';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  button: {
    // color: theme.palette.primary.main,
    width: '100%',
    display: 'block',
  },
  text: {
    marginBottom: theme.spacing(3),
  },
  stepTitle: {
    margin: theme.spacing(2, 0),
    fontWeight: 'bold',
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
}));

export default function SelectQueryType() {
  const match = useRouteMatch();
  const {importId} = match.params;

  const classes = useStyles();
  const queryTypes = useSelector(
    state => {
      const importResource = selectors.resource(state, 'imports', importId);

      return importResource.rdbms?.queryType;
    },
    (left, right) => left && right && left.length === right.length
  );
  const getMappingUrl = useCallback(queryType => {
    const index = queryTypes.indexOf(queryType);

    return `${match.url}/${index}/view`;
  }, [match.url, queryTypes]);

  // If there is only one query type then we can safely
  // take the user to the query builder relating to that Query Type
  if (queryTypes.length === 1) {
    return <Redirect push={false} to={getMappingUrl(queryTypes[0])} />;
  }

  // Finally, render a table of imports to choose from...
  return (
    <div className={classes.root}>
      {/* <Typography className={classes.text} variant="h5">
        Select the Query Type.
      </Typography> */}
      {queryTypes.map(i => (
        <Fragment key={i}>
          <Button
            data-key="mapping"
            className={classes.button}
            component={Link}
            to={getMappingUrl(i)}>
            <Typography variant="h6" color="primary">
              {i}
            </Typography>
          </Button>
        </Fragment>
      ))}
    </div>
  );
}
