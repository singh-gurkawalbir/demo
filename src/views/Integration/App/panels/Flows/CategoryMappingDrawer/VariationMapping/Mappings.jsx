import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import Mappings from '../BasicMapping/MappingsWrapper';
import * as selectors from '../../../../../../../reducers';

const emptySet = [];
const useStyles = makeStyles(() => ({
  fullWidth: {
    width: '100%',
  },
}));

export default function VariationMappings({
  integrationId,
  flowId,
  sectionId,
}) {
  const classes = useStyles();
  const { fields: generateFields } =
    useSelector(state =>
      selectors.categoryMappingGenerateFields(state, integrationId, flowId, {
        sectionId,
      })
    ) || {};

  return (
    <div className={classes.fullWidth}>
      <Mappings
        id={`${flowId}-${sectionId}`}
        flowId={flowId}
        integrationId={integrationId}
        sectionId={sectionId}
        generateFields={generateFields || emptySet}
      />
    </div>
  );
}
