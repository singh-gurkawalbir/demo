import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import EditorField from './DynaEditor';
import actions from '../../../actions';
import * as selectors from '../../../reducers';
import { isNewId } from '../../../utils/resource';
import scriptHookStubs from '../../../utils/scriptHookStubs';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import Spinner from '../../Spinner';

const useStyles = makeStyles({
  editor: {
    height: 250,
  },
});

export default function DynaScriptContent(props) {
  const { id, onFieldChange, resourceId, value, options = {} } = props;
  const classes = useStyles();
  const data = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'scripts',
    resourceId
  );
  const scriptContent = useMemo(() => {
    if (data && data.merged && data.merged.content !== undefined) {
      return data.merged && data.merged.content;
    } if (isNewId(resourceId)) {
      return '';
    }

    return undefined;
  }, [data, resourceId]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (scriptContent === undefined && !isNewId(resourceId)) {
      dispatch(actions.resource.request('scripts', resourceId));
    }
  }, [dispatch, resourceId, scriptContent]);

  const [valueChanged, setValueChanged] = useState(false);

  useEffect(() => {
    setValueChanged(true);
  }, [scriptContent]);
  // onFieldChange is a bound function and causing endless recursive calls
  useEffect(() => {
    if (valueChanged) {
      onFieldChange(id, scriptContent, true);
      setValueChanged(false);
    }
  }, [id, onFieldChange, scriptContent, valueChanged]);

  useEffect(() => {
    if (
      options.scriptFunctionStub &&
      scriptHookStubs[options.scriptFunctionStub]
    ) {
      // TODO @Raghu: Revisit updating script content
      const updatedScriptContent =
        value + scriptHookStubs[options.scriptFunctionStub];

      onFieldChange(id, updatedScriptContent, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, options.scriptFunctionStub]);

  if (scriptContent === undefined) {
    return (
      <span className={classes.spinner}>
        <Spinner size={24} />
      </span>
    );
  }

  return (
    <EditorField
      {...props}
      editorClassName={classes.editor}
      mode="javascript"
    />
  );
}
