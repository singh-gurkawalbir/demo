import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import EditorDialog from '../EditorDialog';
import HttpRequestBodyEditor from './';
import DynaLookupEditor from '../../DynaForm/fields/DynaLookupEditor';

const useStyles = makeStyles(() => ({
  actionSection: {
    width: '100%',
    display: 'inline-block',
    marginBottom: '12px',
  },
}));

export default function HttpRequestBodyDialog(props) {
  const { id, rule, data, lookupId, lookups, onFieldChange, ...rest } = props;
  const defaults = {
    layout: 'compact',
    width: '80vw',
    height: '50vh',
    open: true,
  };
  const classes = useStyles();

  return (
    <EditorDialog id={id} {...defaults} {...rest}>
      <Fragment>
        {lookupId && (
          <div className={classes.actionSection}>
            <DynaLookupEditor
              id={lookupId}
              label="Manage Lookups"
              value={lookups}
              onFieldChange={onFieldChange}
            />
          </div>
        )}

        <HttpRequestBodyEditor editorId={id} rule={rule} data={data} />
      </Fragment>
    </EditorDialog>
  );
}
