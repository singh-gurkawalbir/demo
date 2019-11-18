import { Fragment, useState, useCallback } from 'react';
import {
  useSelector,

  // , useDispatch
} from 'react-redux';
import { Typography } from '@material-ui/core';
import EditIcon from '../../../icons/EditIcon';
import AddIcon from '../../../icons/AddIcon';
import DynaText from '../DynaText';
import * as selectors from '../../../../reducers';
import ModalDialog from '../../../ModalDialog';
import DynaSelect from '../DynaSelect';

const SecondLevelModal = () => {
  <ModalDialog show>
    <Typography>Select Referenced Fields</Typography>
    <Fragment />
  </ModalDialog>;
};

const FirstLevelModal = props => {
  const { options: selectedSObject, connectionId } = props;
  const selectOptions = useSelector(state => {
    const options = [];

    options[0] = {};
    const { data } = selectors.optionsFromMetadata({
      state,
      connectionId,
      commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
      filterKey: 'salesforce-sObjects-noReferenceFields',
    });

    options[0].items = data;

    return options;
  });
  // referencedFields Se
  const [selectedParent, setSelectedParent] = useState('');
  const onSelect = useCallback((id, selectedValue) => {
    setSelectedParent(selectedValue);
  }, []);
  const [selectedReferenceFields, setSelectedReferenceFields] = useState('');
  const onTextChange = useCallback((id, selectedValue) => {
    setSelectedReferenceFields(selectedValue);
  }, []);
  const [secondLevelModalOpen, setSecondLevelModalOpen] = useState(false);
  const toggle = useCallback(
    () => setSecondLevelModalOpen(state => !state),
    []
  );

  return (
    <ModalDialog show>
      <Typography>Referenced Fields</Typography>
      <Fragment>
        <DynaSelect
          options={selectOptions}
          onFieldChange={onSelect}
          value={selectedParent}
        />

        <DynaText
          onFieldChange={onTextChange}
          value={selectedReferenceFields}
        />
        <AddIcon disabled={!!selectedParent} onClick={toggle} />
        {secondLevelModalOpen ? (
          <SecondLevelModal
            {...props}
            connectionId={connectionId}
            selectedParent={selectedParent}
          />
        ) : null}
      </Fragment>
    </ModalDialog>
  );
};

export default function DynaRequiredTrigger(props) {
  const [firstLevelModalOpen, setFirstLevelModalOpen] = useState(false);
  const toggle = useCallback(() => setFirstLevelModalOpen(state => !state), []);

  //   const [referencedFields, setReferencedFields] = useState('');

  return (
    <Fragment>
      {firstLevelModalOpen ? <FirstLevelModal {...props} /> : null}
      <DynaText {...props} options={null} />
      <EditIcon onClick={toggle} />
    </Fragment>
  );
}
