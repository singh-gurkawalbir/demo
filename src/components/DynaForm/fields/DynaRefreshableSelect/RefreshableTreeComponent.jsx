import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import RefreshIcon from '../../../icons/RefreshIcon';
import ArrowDownIcon from '../../../icons/ArrowDownIcon';
import ArrowUpIcon from '../../../icons/ArrowUpIcon';
import DynaCheckbox from '../checkbox/DynaCheckbox';
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

const RefreshButton = ({connectionId, nodeId, refreshNodes,
  setRefreshNodes, selectedNodeBasePath, status}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (refreshNodes.includes(nodeId) && status !== 'requested') {
      setRefreshNodes(nodes => nodes.filter(node => node !== nodeId));
    }
  }, [nodeId, refreshNodes, setRefreshNodes, status]);

  if (refreshNodes.includes(nodeId) && status === 'requested') return <Spinner />;

  return (
    <RefreshIcon
      onClick={evt => {
        setRefreshNodes(nodes => [...nodes, nodeId]);
        dispatch(
          actions.metadata.refresh(
            connectionId,
            selectedNodeBasePath,
            {refreshCache: true}
          ));
        evt.preventDefault();
      }} />
  );
};

const RefreshTreeElement = props => {
  const {
    label,
    connectionId,
    metaBasePath,
    // setExpanded,
    refreshNodes,
    setRefreshNodes,
    expanded,
    selectedReferenceTo,
    selectedRelationshipName,
    level,
  } = props;

  const nodeId = `${selectedRelationshipName}${level},${selectedReferenceTo}`;

  const selectedNodeBasePath = `${metaBasePath}${selectedReferenceTo}`;
  const { status } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, selectedNodeBasePath, 'salesforce-sObjects-referenceFields');

  const LabelEle = () => (
    <>
      <span>{selectedRelationshipName} Fields...</span>
      <RefreshButton
        nodeId={nodeId}
        refreshNodes={refreshNodes}
        setRefreshNodes={setRefreshNodes}
        connectionId={connectionId}
        status={status}
        selectedNodeBasePath={selectedNodeBasePath}
         />
    </>
  );

  return (
    <TreeItem
      key={label}
      label={<LabelEle />}
      endIcon={<RefreshIcon />}
      nodeId={nodeId}>
      {expanded.includes(nodeId) ? (
        (status === 'received' && <TreeViewComponent {...props} key={label} />) || <Spinner />
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
        <Spinner />
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
  const [refreshNodes, setRefreshNodes] = useState([]);
  const [toggleOpenReferenceTo, setToggleOpenReferenceTo] = useState();

  const dispatch = useDispatch();
  const { status } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId,
    `${metaBasePath}${selectedReferenceTo}`, 'salesforce-sObjects-referenceFields');

  // get the status of the opened node status
  const { status: toggleOpenNodeStatus } = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId,
    `${metaBasePath}${toggleOpenReferenceTo}`, 'salesforce-sObjects-referenceFields');

  useEffect(() => {
    // if the opened node does not have metadata fetch it
    if (toggleOpenReferenceTo && toggleOpenNodeStatus !== 'received') {
      dispatch(
        actions.metadata.refresh(
          connectionId,
          `${metaBasePath}${toggleOpenReferenceTo}`,
          {refreshCache: true}
        )
      );
    }
  }, [connectionId, dispatch, metaBasePath, toggleOpenNodeStatus, toggleOpenReferenceTo]);
  const onNodeToggle = (event, newExpandedNodes) => {
    // get expanded node id

    const newExpandedNode = newExpandedNodes.find(node => !expanded.includes(node));

    if (newExpandedNode) {
      const referenceTo = newExpandedNode.split(',')[1];

      // newly opened toggle node
      setToggleOpenReferenceTo(referenceTo);
    }
    setExpanded(newExpandedNodes);
  };

  useEffect(() => {
    // on load get reference to metadata
    if (status !== 'received') {
      dispatch(
        actions.metadata.refresh(
          connectionId,
          `${metaBasePath}${selectedReferenceTo}`, {refreshCache: true}
        )
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    status === 'received'
      ? (
        <TreeView
          expanded={expanded}
          onNodeToggle={onNodeToggle}
          defaultCollapseIcon={<ArrowUpIcon />}
          defaultExpandIcon={<ArrowDownIcon />}>
          <TreeViewComponent
            refreshNodes={refreshNodes}
            setRefreshNodes={setRefreshNodes}
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
      )
      : <Spinner />
  );
}
