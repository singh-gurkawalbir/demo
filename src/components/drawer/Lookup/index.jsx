/* eslint-disable react/jsx-handler-names */
import React, { useState, useCallback } from 'react';
import { Switch, Route, useRouteMatch, useHistory, useLocation, matchPath } from 'react-router-dom';
import {
  makeStyles,
  TableCell,
  TableRow,
  Table,
  TableBody,
  TableHead,
} from '@material-ui/core';
import { filter } from 'lodash';
import RightDrawer from '../Right';
import DrawerHeader from '../Right/DrawerHeader';
import DrawerContent from '../Right/DrawerContent';
import DrawerFooter from '../Right/DrawerFooter';
import AddEditLookup from './Manage';
import SaveButtonGroup from './Manage/SaveButtonGroup';
import LookupListRow from '../../Lookup/LookupListRow';
import AddIcon from '../../icons/AddIcon';
import { OutlinedButton, TextButton } from '../../Buttons';

const useStyles = makeStyles(theme => ({
  listing: {
    minHeight: '30vh',
    maxHeight: '50vh',
  },
  actionButton: {
    float: 'right',
    marginBottom: theme.spacing(1),
  },
  row: {
    background: 'celigoWhite',
  },
  columnName: {
    width: '75%',
    textAlign: 'left',
  },
  columnAction: {
    width: '25%',
    textAlign: 'center',
  },
}));

const rootPath = 'lookup';

export default function LookupDrawer({lookups, onSave, options, disabled, resourceId, resourceType, flowId }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const [error, setError] = useState();
  const [value, setValue] = useState(lookups || []);
  const [selectedLookup, setSelectedLookup] = useState({});

  const fullPath = `${match.url}/${rootPath}`;
  const { isExact } = matchPath(location.pathname, fullPath) || {};

  let drawerTitle;

  if (location.pathname.includes('lookup/add')) {
    drawerTitle = 'Create lookup';
  } else if (location.pathname.includes('lookup/edit')) {
    drawerTitle = 'Edit lookup';
  } else {
    drawerTitle = 'Manage lookups';
  }

  const handleDelete = useCallback(
    lookupObj => {
      if (lookupObj && lookupObj.name) {
        const modifiedLookups = filter(
          value,
          obj => obj.name !== lookupObj.name
        );

        // updating local state
        setValue(modifiedLookups);

        onSave(modifiedLookups);
      }
    },
    [onSave, value]
  );
  const handleEdit = useCallback(val => {
    setSelectedLookup(val);
    history.push(`${location.pathname}/edit`);
  }, [history, location.pathname]);

  const handleAdd = useCallback(() => {
    setError();
    setSelectedLookup({});
    history.push(`${location.pathname}/add`);
  }, [history, location.pathname]);

  const handleSubmit = useCallback(
    (isEdit, val, shouldClose) => {
      const lookupsTmp = [...value];

      if (!isEdit) {
        if (!lookupsTmp.find(ele => ele.name === val.name)) {
          setError();
          lookupsTmp.push(val);
          onSave(lookupsTmp);
        } else {
          // showing error for duplicate name
          setError('Lookup with same name is already present!');

          return;
        }
      } else if (selectedLookup) {
        setError();
        const index = lookupsTmp.findIndex(
          ele => ele.name === selectedLookup.name
        );

        lookupsTmp[index] = val;

        onSave(lookupsTmp);
      }

      setValue(lookupsTmp);
      if (shouldClose) { history.goBack(); }
    },
    [history, onSave, selectedLookup, value]
  );

  return (
    <RightDrawer
      path={rootPath}
      height="tall"
      width="default"
      variant="temporary"
      onClose={history.goBack}>
      <DrawerHeader title={drawerTitle} hideBackButton={!value.length} />
      <DrawerContent>
        <Switch>
          <Route path={[`${match.url}/${rootPath}/add`, `${match.url}/${rootPath}/edit`]}>
            <AddEditLookup
              value={selectedLookup}
              error={error}
              options={options}
              disabled={disabled}
              formKey={`lookup-${resourceId}`}
              resourceId={resourceId}
              resourceType={resourceType}
              flowId={flowId} />
          </Route>
          <Route path={`${match.url}/${rootPath}`}>
            <>
              <TextButton
                className={classes.actionButton}
                onClick={handleAdd}
                startIcon={<AddIcon />}
                data-test="Create lookup">
                Create lookup
              </TextButton>
              <div className={classes.listing}>
                <Table
                  classes={{
                    root: classes.row,
                  }}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.columnName}>Name</TableCell>
                      <TableCell className={classes.columnAction}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {value.map(r => (
                      <LookupListRow
                        classes={classes}
                        value={r}
                        key={r.name}
                        disabled={disabled}
                        onDelete={handleDelete}
                        onEdit={handleEdit} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          </Route>
        </Switch>
      </DrawerContent>
      <DrawerFooter>
        {isExact ? (
          <OutlinedButton
            data-test="closeLookupListing"
            onClick={history.goBack}>
            Close
          </OutlinedButton>
        ) : (
          <SaveButtonGroup
            value={selectedLookup}
            parentOnSave={handleSubmit}
            formKey={`lookup-${resourceId}`}
            onCancel={history.goBack}
            disabled={disabled}
            resourceType={resourceType}
            resourceId={resourceId} />
        )}
      </DrawerFooter>
    </RightDrawer>
  );
}
