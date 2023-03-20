/* eslint-disable react/jsx-handler-names */
import React, { useState, useCallback, useEffect } from 'react';
import { Switch, Route, useRouteMatch, useHistory, useLocation, matchPath } from 'react-router-dom';
import { TableCell, TableRow, Table, TableBody, TableHead } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import RightDrawer from '../Right';
import DrawerHeader from '../Right/DrawerHeader';
import DrawerContent from '../Right/DrawerContent';
import DrawerFooter from '../Right/DrawerFooter';
import AddEditLookup from './Manage';
import SaveButtonGroup from './Manage/SaveButtonGroup';
import LookupListRow from '../../Lookup/LookupListRow';
import AddIcon from '../../icons/AddIcon';
import { OutlinedButton, TextButton } from '../../Buttons';
import { LOOKUP_DRAWER_FORM_KEY } from '../../../constants';
import { hashCode } from '../../../utils/string';
import useFormOnCancelContext from '../../FormOnCancelContext';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';

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

export default function LookupDrawer({
  lookups,
  onSave,
  options,
  disabled,
  resourceId,
  resourceType,
  flowId}) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const location = useLocation();
  const [error, setError] = useState();
  const [value, setValue] = useState(lookups || []);
  const lookupsHash = hashCode(lookups);

  // used to remount the form on save
  const [remountCount, setRemountCount] = useState(0);

  // index of the currently selected lookup
  const [lookupIndex, setLookupIndex] = useState(0);

  const addLookupPath = buildDrawerUrl({ path: drawerPaths.LOOKUP.ADD, baseUrl: match.url });
  const editLookupPath = buildDrawerUrl({ path: drawerPaths.LOOKUP.EDIT, baseUrl: match.url });
  const rootLookupPath = buildDrawerUrl({ path: drawerPaths.LOOKUP.ROOT, baseUrl: match.url});

  const { isExact } = matchPath(location.pathname, rootLookupPath) || {};

  let drawerTitle;
  let showBackButton;

  if (location.pathname.includes('lookup/add')) {
    drawerTitle = 'Create lookup';
    showBackButton = !!value?.length;
  } else if (location.pathname.includes('lookup/edit')) {
    showBackButton = true;
    drawerTitle = 'Edit lookup';
  } else {
    showBackButton = false;
    drawerTitle = 'Manage lookups';
  }

  const handleDelete = useCallback(index => () => {
    if (index >= 0 && index < value.length) {
      const modifiedLookups = [...value];

      modifiedLookups.splice(index, 1);
      // updating local state
      setValue(modifiedLookups);

      onSave(modifiedLookups);
    }
  },
  [onSave, value]
  );
  const handleEdit = useCallback(index => () => {
    // set the lookupIndex to currently selected lookup
    setLookupIndex(index);
    history.push(editLookupPath);
  }, [history, editLookupPath]);

  const handleAdd = useCallback(() => {
    setError();
    // set the lookupIndex to add new lookup to value array at the end
    setLookupIndex(value.length);
    history.push(addLookupPath);
  }, [history, addLookupPath, value]);

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
      } else if (lookupIndex >= 0 && lookupIndex < value.length) {
        setError();
        lookupsTmp[lookupIndex] = val;

        onSave(lookupsTmp);
      }

      setValue(lookupsTmp);
      if (shouldClose) { history.goBack(); }
      // remount the form on save
      setRemountCount(remountCount => remountCount + 1);
    },
    [history, lookupIndex, onSave, value]
  );
  const selectedLookup = (value && lookupIndex >= 0 && lookupIndex < value.length) ? value[lookupIndex] : {};
  const {setCancelTriggered} = useFormOnCancelContext(LOOKUP_DRAWER_FORM_KEY);
  const handleClose = isExact ? history.goBack : setCancelTriggered;

  useEffect(() => {
    // update the state if the lookups are modified
    // from parent component
    setValue(lookups || []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookupsHash]);

  return (
    <RightDrawer
      path={drawerPaths.LOOKUP.ROOT}
      height="tall"
      width="default"
      onClose={history.goBack}>
      <DrawerHeader title={drawerTitle} handleClose={handleClose} showBackButton={showBackButton} />
      <DrawerContent>
        <Switch>
          <Route
            path={[addLookupPath, editLookupPath]}>
            <AddEditLookup
              value={selectedLookup}
              error={error}
              options={options}
              disabled={disabled}
              formKey={LOOKUP_DRAWER_FORM_KEY}
              resourceId={resourceId}
              resourceType={resourceType}
              flowId={flowId}
              remountCount={remountCount}
            />
          </Route>
          <Route path={rootLookupPath}>
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
                    {value.map((r, index) => (
                      <LookupListRow
                        classes={classes}
                        value={r}
                        key={r.name}
                        disabled={disabled}
                        onDelete={handleDelete(index)}
                        onEdit={handleEdit(index)} />
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
            formKey={LOOKUP_DRAWER_FORM_KEY}
            onCancel={history.goBack}
            disabled={disabled}
            resourceType={resourceType}
            resourceId={resourceId} />
        )}
      </DrawerFooter>
    </RightDrawer>
  );
}
