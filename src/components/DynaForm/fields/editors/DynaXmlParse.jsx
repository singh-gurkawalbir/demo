import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import XmlParseEditorDialog from '../../../AFE/XmlParseEditor/Dialog';

export default function DynaXmlParse(props) {
  const { id, onFieldChange, value, label, resourceId, resourceType } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const dispatch = useDispatch();
  /*
   * Fetches Raw data - XML file to be parsed based on the rules
   */
  const xmlData = useSelector(state => {
    const rawData = selectors.getResourceSampleDataWithStatus(
      state,
      resourceId,
      'raw'
    );

    return rawData && rawData.data && rawData.data.body;
  });
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const {
        resourcePath,
        trimSpaces,
        stripNewLineChars,
        textNodeName,
        attributePrefix,
        listNodes,
        includeNodes,
        excludeNodes,
      } = editorValues;

      onFieldChange(id, {
        resourcePath,
        trimSpaces,
        stripNewLineChars,
        textNodeName,
        attributePrefix,
        listNodes,
        includeNodes,
        excludeNodes,
      });
      // On change of rules, trigger sample data update
      // It calls processor on final rules to parse xml file
      dispatch(
        actions.sampleData.request(
          resourceId,
          resourceType,
          {
            type: 'xml',
            file: xmlData,
            editorValues,
          },
          'file'
        )
      );
    }

    handleEditorClick();
  };

  return (
    <Fragment>
      {showEditor && (
        <XmlParseEditorDialog
          title="XML parse options"
          id={id + resourceId}
          mode="xml"
          data={xmlData}
          rule={value}
          onClose={handleClose}
        />
      )}
      <Button data-test={id} variant="contained" onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}
