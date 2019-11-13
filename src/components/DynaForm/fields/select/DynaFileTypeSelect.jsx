import { useSelector } from 'react-redux';
import DynaSelect from '../DynaSelect';
import LoadResources from '../../../LoadResources';
import * as selectors from '../../../../reducers';

const FileTypeSelect = props => {
  const { userDefinitionId } = props;
  let { value } = props;
  // Fetches the selected filedefinition resource by userDefinitionId
  const userFileDefinition = useSelector(state => {
    if (userDefinitionId) {
      return selectors.resource(state, 'filedefinitions', userDefinitionId);
    }
  });

  // Incase of file definitions, format is determined by user file definition
  if (value === 'filedefinition') {
    const { format } = userFileDefinition || {};

    value = ['delimited/x12', 'delimited'].includes(format)
      ? 'filedefinition'
      : format;
  }

  return <DynaSelect {...props} value={value} />;
};

export default function DynaFileTypeSelect(props) {
  return (
    <LoadResources resources="filedefinitions">
      <FileTypeSelect {...props} />
    </LoadResources>
  );
}
