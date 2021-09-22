import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import LookupDialog from '../../Lookup/index';
import actions from '../../../actions';
import { OutlinedButton } from '../../Buttons';

export default function DynaLookupEditor(props) {
  const dispatch = useDispatch();
  const [showEditor, setShowEditor] = useState(false);
  const {
    id,
    onFieldChange,
    formKey,
    value,
    label,
    connectionId,
    resourceId,
    resourceType,
    flowId,
  } = props;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleUpdate = lookups => {
    // TODO: @ashu remove this onfieldchange if no component is doing additional update
    if (onFieldChange) {
      onFieldChange(id, lookups);
    } else {
      dispatch(actions.form.fieldChange(formKey)(id, lookups));
    }
  };

  return (
    <>
      {showEditor && (
        <LookupDialog
          id={id}
          lookups={value}
          onCancel={handleEditorClick}
          connectionId={connectionId}
          resourceId={resourceId}
          resourceType={resourceType}
          flowId={flowId}
          onSave={handleUpdate}
        />
      )}
      <OutlinedButton
        data-test={id}
        color="secondary"
        onClick={handleEditorClick}>
        {label}
      </OutlinedButton>
    </>
  );
}
