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
  const { xmlData } = useSelector(state => {
    const rawData = selectors.getResourceSampleDataWithStatus(
      state,
      resourceId,
      'raw'
    );

    return { xmlData: rawData && rawData.data && rawData.data.body };
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
      // @TODO: Find a best way to create these rules.
      // Use 'requestBody' in processorLogic for Editor
      const xmlParseRules = {
        doc: {
          parsers: [
            {
              rules: {
                V0_json: false,
                trimSpaces,
                stripNewLineChars,
                textNodeName,
                attributePrefix,
                listNodes,
                includeNodes,
                excludeNodes,
              },
              type: 'xml',
              version: 1,
            },
          ],
        },
        resourcePath,
      };

      // On change of rules, trigger sample data update
      // It calls processor on final rules to parse xml file
      dispatch(
        actions.sampleData.request(
          resourceId,
          resourceType,
          {
            type: 'xml',
            file: xmlData,
            rules: xmlParseRules,
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
      <Button variant="contained" onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}
