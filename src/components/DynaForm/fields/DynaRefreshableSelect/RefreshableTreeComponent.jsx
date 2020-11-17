import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import RefreshIcon from '../../../icons/RefreshIcon';
import ArrowDownIcon from '../../../icons/ArrowDownIcon';
import ArrowUpIcon from '../../../icons/ArrowUpIcon';
import DynaCheckbox from '../checkbox/DynaCheckbox';
import Spinner from '../../../Spinner';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
// TODO (Surya): This component doesnt support adding additional action button for refresh with each Node.
// refreshCache=true should be appended with api call when refresh button clicked.
const fieldToOption = field => ({
  label: field.label,
  value: field.value,
  referenceTo: field.referenceTo,
  picklistValues: field.picklistValues,
  type: field.type,
});
const fieldToOptionReferencedFields = field => ({
  label: field.relationshipName,
  value: field.relationshipName,
  referenceTo: field.referenceTo,
});
const NestedValueCheckbox = props => {
  const {
    setSelectedValues,
    attachedParentNode,
    selectedValues,
    label,
    isFieldMetaRequired,
    field,
  } = props;

  const value = useMemo(() => selectedValues.some(v => {
    if (!v) {
      return false;
    }
    if (typeof v === 'string') return v === attachedParentNode;

    return v.label === attachedParentNode;
  }), [attachedParentNode, selectedValues]);

  const onFieldChange = useCallback((id, checkedValue) => {
    setSelectedValues(selectedValues => {
      if (checkedValue) {
        if (isFieldMetaRequired) { return [...selectedValues, {...field, label: attachedParentNode}]; }

        return [...selectedValues, attachedParentNode];
      }

      return selectedValues.filter(
        selectedValue => {
          if (typeof selectedValue === 'string') { return selectedValue !== attachedParentNode; }

          return selectedValue.label !== attachedParentNode;
        }
      );
    });
  }, [attachedParentNode, isFieldMetaRequired, field, setSelectedValues]);

  return (
    <DynaCheckbox
      onFieldChange={onFieldChange}
      label={label}
      value={value}
    />
  );
};

const RefreshTreeElement = props => {
  const {
    label,
    connectionId,
    metaBasePath,
    // setExpanded,
    expanded,
    selectedReferenceTo,
    selectedRelationshipName,
    level,
  } = props;
  const nodeId = `${selectedRelationshipName}${level},${selectedReferenceTo}`;

  const { status } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, `${metaBasePath}${selectedReferenceTo}`, 'salesforce-sObjects-referenceFields');

  return (
    <TreeItem
      key={label}
      label={`${selectedRelationshipName} Fields...`}
      nodeId={nodeId}
      expandIcon={
        status === 'refreshed' ? <RefreshIcon /> : <ArrowDownIcon />
      }>
      {expanded.includes(nodeId) ? (
        <TreeViewComponent {...props} key={label} />
      ) : (
        <></>
      )}
    </TreeItem>
  );
};

function TreeViewComponent(props) {
  const {
    connectionId,
    selectedReferenceTo,
    setSelectedValues,
    selectedValues,
    nestedRelationShipNames,
    skipFirstLevelFields,
    level,
    isFieldMetaRequired,
  } = props;
  const metaBasePath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/`;
  const {data: dataRef, status } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, `${metaBasePath}${selectedReferenceTo}`, 'salesforce-sObjects-referenceFields');
  const {data: dataNonRef } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, `${metaBasePath}${selectedReferenceTo}`, 'salesforce-sObjects-nonReferenceFields');

  const referenceFields = useMemo(() => (dataRef && dataRef.map(fieldToOptionReferencedFields)) || null, [dataRef]);

  const nonReferenceFields = useMemo(() => (dataNonRef && dataNonRef.map(fieldToOption)) || null, [dataNonRef]);

  const skipNonReferencedFields = skipFirstLevelFields && level === 1;

  return (
    <>
      {status === 'refreshed' ? (
        <Spinner size={24} />
      ) : (
        (!skipNonReferencedFields &&
          nonReferenceFields &&
          nonReferenceFields.map(item => {
            const { label, value } = item;
            const attachedParentNode = nestedRelationShipNames
              ? `${nestedRelationShipNames}.${value}`
              : value;

            return (
              <div key={value}>
                <NestedValueCheckbox
                  setSelectedValues={setSelectedValues}
                  attachedParentNode={attachedParentNode}
                  selectedValues={selectedValues}
                  label={label}
                  field={item}
                  isFieldMetaRequired={isFieldMetaRequired}
                />
              </div>
            );
          })) ||
        null
      )}

      {(referenceFields &&
        referenceFields.map(item => {
          const { label, value, referenceTo } = item;

          return (
            <RefreshTreeElement
              {...props}
              key={label}
              level={level + 1}
              label={label}
              selectedReferenceTo={referenceTo}
              selectedRelationshipName={value}
              nestedRelationShipNames={
                nestedRelationShipNames
                  ? `${nestedRelationShipNames}.${value}`
                  : value
              }
            />
          );
        })) ||
        null}
    </>
  );
}

export default function RefreshableTreeComponent(props) {
  const {
    connectionId,
    selectedReferenceTo,
    selectedRelationshipName,
    setSelectedValues,
  } = props;
  const metaBasePath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/`;
  const [expanded, setExpanded] = useState([]);
  const dispatch = useDispatch();
  const statusSelector = useSelector(state => selectedReferenceTo =>
    selectors.metadataOptionsAndResources(state, {
      connectionId,
      commMetaPath: `${metaBasePath}${selectedReferenceTo}`,
      filterKey: 'salesforce-sObjects-referenceFields',
    })
  );
  const onNodeToggle = (nodeId, expanded) => {
    // check for node id

    const referenceTo = nodeId.split(',')[1];
    const { status } = statusSelector(referenceTo);

    if (expanded) {
      if (status !== 'received') {
        dispatch(
          actions.metadata.refresh(
            connectionId,
            `${metaBasePath}${referenceTo}`,
            {refreshCache: true}
          )
        );
      }
      setExpanded(openNodes => [...openNodes, nodeId]);
    } else {
      setExpanded(openNodes =>
        openNodes.filter(openNode => openNode !== nodeId)
      );
    }
  };

  const [hasCalled, setHasCalled] = useState(false);

  useEffect(() => {
    if (!hasCalled && statusSelector(selectedReferenceTo) !== 'received') {
      dispatch(
        actions.metadata.refresh(
          connectionId,
          `${metaBasePath}${selectedReferenceTo}`, {refreshCache: true}
        )
      );
    }
    setHasCalled(true);
  }, [
    dispatch,
    connectionId,
    hasCalled,
    selectedReferenceTo,
    metaBasePath,
    statusSelector,
  ]);

  return (
    <TreeView
      expanded={expanded}
      onNodeToggle={onNodeToggle}
      defaultCollapseIcon={<ArrowUpIcon />}
      defaultExpandIcon={<ArrowDownIcon />}>
      <TreeViewComponent
        setExpanded={setExpanded}
        {...props}
        setSelectedValues={setSelectedValues}
        metaBasePath={metaBasePath}
        selectedReferenceTo={selectedReferenceTo}
        selectedRelationshipName={selectedRelationshipName}
        nestedRelationShipNames={selectedRelationshipName}
        expanded={expanded}
        level={1}
      />
    </TreeView>
  );
}
