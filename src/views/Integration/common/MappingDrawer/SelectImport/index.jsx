import React, { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Divider } from '@material-ui/core';
import * as selectors from '../../../../../reducers';
import { getNetSuiteSubrecordImports } from '../../../../../utils/resource';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    width: '100%'
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
  }
}));

export default function SelectImport({ flowId }) {
  const classes = useStyles();
  const match = useRouteMatch();
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));
  const imports = useSelector(
    state => selectors.flowImports(state, flowId),
    (left, right) => left && right && left.length === right.length
  );
  const [subrecordImports, setSubrecordImports] = useState();
  const [importId, setImportId] = useState();

  useEffect(() => {
    if (imports) {
      let srImports;

      imports.forEach(imp => {
        const currentImportSubrecords = getNetSuiteSubrecordImports(imp);

        if (currentImportSubrecords && currentImportSubrecords.length > 0) {
          if (!srImports) srImports = {};

          srImports[imp._id] = currentImportSubrecords.map(sr => ({
            ...sr,
            name: `${imp.name || imp._id} - ${sr.name} (Subrecord)`,
          }));
        }
      });

      if (srImports) {
        setSubrecordImports(srImports);
      } else if (imports.length === 1) {
        setImportId(imports[0]._id);
      }
    }
  }, []);

  if (!flow) {
    return <Typography>No flow exists with id: {flowId}</Typography>;
  }

  // If there is only one import then we can safely
  // take the user to the mapping of that import
  if (importId) {
    return <Redirect push={false} to={`${match.url}/${importId}`} />;
  }

  const flowName = flow.name || flow._id;

  if (imports.length === 0) {
    // eslint-disable-next-line react/no-unescaped-entities
    return <Typography>The flow "{flowName}", contains no imports.</Typography>;
  }

  // Finally, render a table of imports to choose from...
  return (
    <div className={classes.root}>
      <Typography className={classes.text} variant="h5">
        Select the mapping you would like to edit.
      </Typography>
      <Typography className={classes.stepTitle} variant="h5">
        Step name
      </Typography>

      {imports.map((i, index) => (
        <Fragment key={i._id}>
          <Button
            data-key="mapping"
            className={classes.button}
            component={Link}
            to={`${match.url}/${i._id}`}>
            <Typography variant="h6" color="primary">
              {i.name || i._id}
            </Typography>
          </Button>
          {(index < imports.length - 1) && <Divider className={classes.divider} />}
          {subrecordImports &&
            subrecordImports[i._id] &&
            subrecordImports[i._id].map((sr, index) => (
              <Fragment key={`${i._id}-${sr.fieldId}`}>
                <Divider className={classes.divider} />
                <Button
                  data-test={`subrecordMapping-${index}`}
                  className={classes.button}
                  component={Link}
                  to={`${match.url}/${i._id}/${sr.fieldId}`}>
                  <Typography variant="h6" color="primary">
                    {sr.name}
                  </Typography>
                </Button>
              </Fragment>
            ))}
        </Fragment>
      ))}
    </div>
  );
}
