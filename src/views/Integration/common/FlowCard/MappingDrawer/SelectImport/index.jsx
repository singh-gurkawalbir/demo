import { useState, useEffect, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button } from '@material-ui/core';
import * as selectors from '../../../../../../reducers';
import { getNetSuiteSubrecordImports } from '../../../../../../utils/resource';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
  },
  button: {
    // color: theme.palette.primary.main,
    width: `calc(100% - ${theme.spacing(3)}px)`,
    display: 'block',
  },
  text: {
    marginBottom: theme.spacing(2),
  },
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
    let srImports;

    if (imports) {
      imports.forEach(imp => {
        const currentImportSubrecords = getNetSuiteSubrecordImports(imp);

        if (currentImportSubrecords && currentImportSubrecords.length > 0) {
          if (!srImports) {
            srImports = {};
          }

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
  }, [imports]);

  if (!flow) {
    return <Typography>No flow exists with id: {flowId}</Typography>;
  }

  // If there is only one import then we can safely
  // take the user to the mapping of that import
  if (importId) {
    return <Redirect push={false} to={`${match.url}/${importId}`} />;
  }

  const flowName = flow.name || flow._id;

  if (!imports.length === 0) {
    return <Typography>The {flowName} flow contains no imports.</Typography>;
  }

  // Finally, render a table of imports to choose from...
  return (
    <div className={classes.root}>
      <Typography className={classes.text} variant="h5">
        This flow contains several imports, each of which have mapping.
      </Typography>
      <Typography className={classes.text} variant="h5">
        Select which import you would like to edit the mapping for.
      </Typography>
      {imports.map(i => (
        <Fragment key={i._id}>
          <div key={i._id}>
            <Button
              data-key="mapping"
              className={classes.button}
              component={Link}
              to={`${match.url}/${i._id}`}>
              <Typography variant="h6" color="primary">
                {i.name || i._id}
              </Typography>
              {i.description && <Typography>{i.description}</Typography>}
            </Button>
          </div>
          {subrecordImports &&
            subrecordImports[i._id] &&
            subrecordImports[i._id].map((sr, index) => (
              <div key={`${i._id}-${sr.fieldId}`}>
                <Button
                  data-test={`subrecordMapping-${index}`}
                  // sub-record parent
                  className={classes.button}
                  component={Link}
                  to={`${match.url}/${i._id}/${sr.fieldId}`}>
                  <Typography variant="h6" color="primary">
                    {sr.name}
                  </Typography>
                </Button>
              </div>
            ))}
        </Fragment>
      ))}
    </div>
  );
}
