import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import DynaCheckbox from '../../../../components/DynaForm/fields/checkbox/DynaCheckbox';
import ArrowUpIcon from '../../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import RefreshIcon from '../../../../components/icons/RefreshIcon';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
// TODO (Surya): This component doesnt support adding additional action button for refresh with each Node.
// refreshCache=true should be appended with api call when refresh button clicked.
const fieldToOption = field => ({
  label: field.label,
  value: field.value,
  referenceTo: field.referenceTo,
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
  } = props;

  return (
    <DynaCheckbox
      onFieldChange={(id, checkedValue) => {
        setSelectedValues(selectedValues => {
          if (checkedValue) return [...selectedValues, attachedParentNode];

          return selectedValues.filter(
            selectedValue => selectedValue !== attachedParentNode
          );
        });
      }}
      label={label}
      value={!!selectedValues.includes(attachedParentNode)}
    />
  );
};

const RefreshTreeElement = props => {
  const {
    label,
    ssLinkedConnectionId,
    metaBasePath,
    // setExpanded,
    expanded,
    selectedReferenceTo,
    selectedRelationshipName,
    level,
  } = props;
  const nodeId = `${selectedRelationshipName}${level},${selectedReferenceTo}`;

  const { status } = useSelectorMemo(selectors.makeOptionsFromMetadata, ssLinkedConnectionId,
    `${metaBasePath}${selectedReferenceTo}`, 'salesforce-sObjects-referenceFields');

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
    ssLinkedConnectionId,
    connectionId,
    selectedReferenceTo,
    setSelectedValues,
    selectedValues,
    nestedRelationShipNames,
    skipFirstLevelFields,
    level,

  } = props;
  const metaBasePath = `suitescript/connections/${ssLinkedConnectionId}/connections/${connectionId}/sObjectTypes/`;
  // salesforce/metadata/connections/${connectionId}/sObjectTypes/`;
  const { referenceFields, nonReferenceFields, status } = useSelector(state => {
    const {
      data: referenceFields,
      ...rest
    } = selectors.metadataOptionsAndResources(state, {
      connectionId: ssLinkedConnectionId,
      commMetaPath: `${metaBasePath}${selectedReferenceTo}`,
      filterKey: 'salesforce-sObjects-referenceFields',
    });
    const { data: nonReferenceFields } = selectors.metadataOptionsAndResources(state, {
      connectionId: ssLinkedConnectionId,
      commMetaPath: `${metaBasePath}${selectedReferenceTo}`,
      filterKey: 'salesforce-sObjects-nonReferenceFields',
    });

    return {
      ...rest,
      nonReferenceFields:
        (nonReferenceFields && nonReferenceFields.map(fieldToOption)) || null,
      referenceFields:
        (referenceFields &&
          referenceFields.map(fieldToOptionReferencedFields)) ||
        null,
    };
  });
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
    ssLinkedConnectionId,
    connectionId,
    selectedReferenceTo,
    selectedRelationshipName,
    setSelectedValues,
  } = props;
  const metaBasePath = `suitescript/connections/${ssLinkedConnectionId}/connections/${connectionId}/sObjectTypes/`;
  const [expanded, setExpanded] = useState([]);
  const dispatch = useDispatch();
  const statusSelector = useSelector(state => selectedReferenceTo =>
    selectors.metadataOptionsAndResources(state, {
      connectionId: ssLinkedConnectionId,
      commMetaPath: `${metaBasePath}${selectedReferenceTo}`,
      filterKey: 'salesforce-sObjects-referenceFields',
    })
  );
  const onNodeToggle = (event, newExpandedNodes) => {
    // get expanded node id

    const newExpandedNode = newExpandedNodes.find(node => !expanded.includes(node));

    if (newExpandedNode) {
      const referenceTo = newExpandedNode.split(',')[1];
      const { status } = statusSelector(referenceTo);

      if (status !== 'received') {
        dispatch(
          actions.metadata.refresh(
            ssLinkedConnectionId,
            `${metaBasePath}${referenceTo}`,
            {ignoreCache: true}
          )
        );
      }
    }
    setExpanded(newExpandedNodes);
  };

  const [hasCalled, setHasCalled] = useState(false);

  useEffect(() => {
    if (!hasCalled && statusSelector(selectedReferenceTo) !== 'received') {
      dispatch(
        actions.metadata.refresh(
          ssLinkedConnectionId,
          `${metaBasePath}${selectedReferenceTo}`, {ignoreCache: true}
        )
      );
    }
    setHasCalled(true);
  }, [dispatch, hasCalled, selectedReferenceTo, metaBasePath, statusSelector, ssLinkedConnectionId]);

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
