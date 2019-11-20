import { Fragment, useState, useCallback } from 'react';
import {
  useSelector,

  // , useDispatch
} from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import EditIcon from '../../../icons/EditIcon';
import AddIcon from '../../../icons/AddIcon';
import DynaText from '../DynaText';
import * as selectors from '../../../../reducers';
import ModalDialog from '../../../ModalDialog';
import DynaSelect from '../DynaSelect';
import RefreshableTreeComponent from '../DynaRefreshableSelect/RefreshableTreeComponent';
import Spinner from '../../../Spinner';

const SecondLevelModal = props => {
  const { handleClose, onFieldChange, id, value, ...rest } = props;
  const [selectedValues, setSelectedValues] = useState(
    value ? value.split(',') : []
  );

  return (
    <ModalDialog show handleClose={handleClose}>
      <Typography>Select Referenced Fields</Typography>
      <RefreshableTreeComponent
        {...rest}
        setSelectedValues={setSelectedValues}
        selectedValues={selectedValues}
      />
      <Fragment>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            onFieldChange(id, selectedValues.join(','));
            handleClose();
          }}>
          Add Selected
        </Button>
      </Fragment>
    </ModalDialog>
  );
};

const FirstLevelModal = props => {
  const {
    options: selectedSObject,
    connectionId,
    resourceType,
    handleClose,
    onFieldChange,
    value,
    id,
  } = props;
  const { options: selectOptions, status } = useSelector(state => {
    const options = [];

    options[0] = {};
    const { data, status } = selectors.optionsFromMetadata({
      state,
      connectionId,
      commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${selectedSObject}`,
      filterKey: 'salesforce-sObjects-referenceFields',
    });

    options[0].items =
      (data &&
        data.map(option => ({
          label: option.label,
          value: option.value,
          referenceTo: option.referenceTo,
        }))) ||
      [];

    return { options, status };
  });
  const [selectedParent, setSelectedParent] = useState('');
  const onSelect = useCallback((id, selectedValue) => {
    setSelectedParent(selectedValue);
  }, []);
  const [secondLevelModalOpen, setSecondLevelModalOpen] = useState(false);
  const toggle = useCallback(
    () => setSecondLevelModalOpen(state => !state),
    []
  );
  const { referenceTo: selectedParentReferenceTo } =
    selectOptions[0].items.find(option => option.value === selectedParent) ||
    {};

  return (
    <ModalDialog show handleClose={handleClose}>
      <Typography>Referenced Fields</Typography>
      <Fragment>
        {status === 'received' ? (
          <DynaSelect
            options={selectOptions}
            onFieldChange={onSelect}
            value={selectedParent}
          />
        ) : (
          <Spinner loading />
        )}

        <DynaText id={id} onFieldChange={onFieldChange} value={value} />
        <AddIcon disabled={!!selectedParent} onClick={toggle} />
        {secondLevelModalOpen ? (
          <SecondLevelModal
            id={id}
            resourceType={resourceType}
            connectionId={connectionId}
            selectedParent={selectedParentReferenceTo}
            handleClose={toggle}
            onFieldChange={onFieldChange}
            value={value}
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
      {firstLevelModalOpen ? (
        <FirstLevelModal {...props} handleClose={toggle} />
      ) : null}
      <DynaText {...props} options={null} />
      <EditIcon onClick={toggle} />
    </Fragment>
  );
}
