import React, { useState, useEffect, Fragment, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Divider } from '@material-ui/core';
import { selectors } from '../../../reducers';
import { getNetSuiteSubrecordImports } from '../../../utils/resource';
import { isImportMappingAvailable } from '../../../utils/flows';

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

export default function SelectImport() {
  const match = useRouteMatch();
  const {flowId, importId} = match.params;

  const classes = useStyles();
  const flow = useSelector(state => selectors.resource(state, 'flows', flowId));
  const imports = useSelector(
    state => {
      if (importId) {
        const subRecordResource = selectors.resource(state, 'imports', importId);

        return [subRecordResource];
      }

      const flowImports = selectors.flowImports(state, flowId);

      return flowImports.filter(i => isImportMappingAvailable(i));
    },
    (left, right) => left && right && left.length === right.length
  );
  const [subrecordImports, setSubrecordImports] = useState();
  const [selectedImportId, setSelectedImportId] = useState();
  const getMappingUrl = useCallback(_impId => {
    if (imports.find(({adaptorType, _id}) => _id === _impId && ['RDBMSImport', 'DynamodbImport', 'MongodbImport'].includes(adaptorType))) {
      const url = match.url.replace('/mapping', '/queryBuilder');

      return importId ? url : `${url}/${_impId}`;
    }

    return importId ? `${match.url}/view` : `${match.url}/${_impId}/view`;
  }, [importId, imports, match.url]);

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
        setSelectedImportId(imports[0]._id);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!flow) {
    return <Typography>No flow exists with id: {flowId}</Typography>;
  }

  // If there is only one import then we can safely
  // take the user to the mapping of that import
  if (selectedImportId) {
    return <Redirect push={false} to={getMappingUrl(selectedImportId)} />;
  }
  imports.sort((i1, i2) => {
    const i1index = flow.pageProcessors?.findIndex(i => i.type === 'import' && i._importId === i1._id);
    const i2index = flow.pageProcessors?.findIndex(i => i.type === 'import' && i._importId === i2._id);

    return i1index - i2index;
  });
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
            to={getMappingUrl(i._id)}>
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
                  to={importId ? `${match.url}/${sr.fieldId}/view` : `${match.url}/${i._id}/${sr.fieldId}/view`}>
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
