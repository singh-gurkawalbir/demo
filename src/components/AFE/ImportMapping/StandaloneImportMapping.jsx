import { useDispatch, useSelector } from 'react-redux';
import { makeStyles, IconButton } from '@material-ui/core';
import MappingUtil from '../../../utils/mapping';
import * as ResourceUtil from '../../../utils/resource';
import LookupUtil from '../../../utils/lookup';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import ImportMapping from './';
import LoadResources from '../../../components/LoadResources';

const CloseIcon = require('../../../components/icons/CloseIcon').default;

/**
 *
 *(This component can be used to manage Import lookups)
 * @export
 * @param {string} id (unique Id)
 * @param {string} resourceId (Import Resource Id)
 * @param {function} onClose (callback for closing the mapping dialog)
 */

const useStyles = makeStyles(theme => ({
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default function StandaloneImportMapping(props) {
  const { id, resourceId, onClose } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  /*
     Using dummy data for functionality demonstration. generate fields and
     extrct fields to be extracted later when flow builder is ready
     The best way to fetch extract and generate field is to be figured out later
     */
  const generateFields = ['myName', 'myId'];
  const extractFields = ['name', 'id'];
  const resourceData = useSelector(state =>
    selectors.resource(state, 'imports', resourceId)
  );
  const resourceType = ResourceUtil.getResourceSubType(resourceData);
  const mappings = MappingUtil.getMappingFromResource(
    resourceData,
    resourceType.type
  );
  // check for case when there is no lookups and we saving without lookups
  const lookups = LookupUtil.getLookupFromResource(
    resourceData,
    resourceType.type
  );
  const handleClose = (closeModal, _mappings, _lookups) => {
    // perform save operation only when mapping object is passed as parameter to the function.
    if (_mappings) {
      const patchSet = [];
      const mappingPath = MappingUtil.getMappingPath(resourceType.type);

      // if mapping doesnt exist in resouce object , perform add patch else replace patch
      patchSet.push({
        op: mappings ? 'replace' : 'add',
        path: mappingPath,
        value: { fields: _mappings },
      });

      // update _lookup only if its being passed as param to function
      if (_lookups) {
        const lookupPath = LookupUtil.getLookupPath(resourceType.type);

        patchSet.push({
          op: lookups ? 'replace' : 'add',
          path: lookupPath,
          value: _lookups,
        });
      }

      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('imports', resourceId, 'value'));
    }

    if (closeModal) onClose();
  };

  return (
    <LoadResources resources="imports">
      <ImportMapping
        title="Define Import Mapping"
        id={id}
        application={resourceType.type}
        lookups={lookups}
        isStandaloneMapping
        resourceId={resourceId}
        mappings={mappings}
        generateFields={generateFields}
        extractFields={extractFields}
        onClose={handleClose}>
        <IconButton
          aria-label="Close"
          className={classes.closeButton}
          onClick={() => onClose()}>
          <CloseIcon />
        </IconButton>
      </ImportMapping>
    </LoadResources>
  );
}
