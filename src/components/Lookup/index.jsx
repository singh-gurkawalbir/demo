import React, { useState, useCallback } from 'react';
import { TableCell, TableRow, Table, TableBody, TableHead } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { filter } from 'lodash';
import { TextButton } from '@celigo/fuse-ui';
import ModalDialog from '../ModalDialog';
import ManageLookup from './Manage';
import LookupListRow from './LookupListRow';

const useStyles = makeStyles(() => ({
  listing: {
    minHeight: '30vh',
    maxHeight: '50vh',
  },
  row: {
    background: 'transparent',
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

export default function Lookup(props) {
  const {
    lookups = [],
    onSave,
    onCancel,
    resourceId,
    resourceType,
    flowId,
    disabled,
    options,
  } = props;
  const classes = useStyles();
  const [value, setValue] = useState(lookups || []);
  const [showListView, setShowListView] = useState(true);
  const [selectedLookup, setSelectedLookup] = useState({});
  const [error, setError] = useState();
  const handleSubmit = useCallback(
    (isEdit, val) => {
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
      setShowListView(!showListView);
    },
    [onSave, selectedLookup, showListView, value]
  );
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
  const handleEdit = val => {
    setSelectedLookup(val);
    setShowListView(false);
  };

  const toggleLookupMode = () => {
    setError();
    setSelectedLookup({});
    setShowListView(!showListView);
  };

  return (
    <ModalDialog
      show
      actionLabel={showListView && 'Create lookup'}
      actionHandler={showListView && toggleLookupMode}
      minWidth="sm"
      maxWidth="md">
      <span>Manage lookups</span>
      {showListView ? (
        <div className={classes.listing}>
          <Table>
            <TableHead>
              <TableRow
                classes={{
                  root: classes.row,
                }}>
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
                  onEdit={handleEdit}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <ManageLookup
          value={selectedLookup}
          error={error}
          onCancel={toggleLookupMode}
          options={options}
          onSave={handleSubmit}
          disabled={disabled}
          resourceId={resourceId}
          resourceType={resourceType}
          flowId={flowId}
        />
      )}
      {showListView && (
        <TextButton data-test="closeLookupListing" onClick={onCancel}>
          Close
        </TextButton>
      )}
    </ModalDialog>
  );
}
