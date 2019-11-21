import { useState, Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import RefreshIcon from '../../../icons/RefreshIcon';
import DynaCheckbox from '../DynaCheckbox';

const fieldToOption = field => ({
  label: field.label,
  value: field.value,
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
    selectedParent,
    connectionId,
    metaBasePath,
    // setExpanded,
    expanded,
    referenceTo,
    parentValue,
    level,
  } = props;
  const nodeId = `${parentValue}${level},${referenceTo}`;
  const { status } = useSelector(state =>
    selectors.metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath: `${metaBasePath}${selectedParent}`,
      filterKey: 'salesforce-sObjects-referenceFields',
    })
  );

  return (
    <TreeItem
      key={label}
      label={`${parentValue} Fields...`}
      nodeId={nodeId}
      expandIcon={
        status === 'refreshed' ? <RefreshIcon /> : <ChevronRightIcon />
      }>
      {expanded.includes(nodeId) ? (
        <TreeViewComponent
          {...props}
          key={label}
          label={label}
          selectedParent={selectedParent}
        />
      ) : (
        <Fragment />
      )}
    </TreeItem>
  );
};

function TreeViewComponent(props) {
  const {
    connectionId,
    selectedParent,
    setSelectedValues,
    selectedValues,
    parentValue,
    skipFirstLevelFields,
    level,
  } = props;
  const metaBasePath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/`;
  const { referenceFields, nonReferenceFields, status } = useSelector(state => {
    const {
      data: referenceFields,
      ...rest
    } = selectors.metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath: `${metaBasePath}${selectedParent}`,
      filterKey: 'salesforce-sObjects-referenceFields',
    });
    const { data: nonReferenceFields } = selectors.metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath: `${metaBasePath}${selectedParent}`,
      filterKey: 'salesforce-sObjects-nonReferenceFields',
    });

    return {
      ...rest,
      nonReferenceFields:
        (nonReferenceFields && nonReferenceFields.map(fieldToOption)) || null,
      referenceFields:
        (referenceFields && referenceFields.map(fieldToOption)) || null,
    };
  });

  if (status !== 'received') return null;
  const skipNonReferencedFields = skipFirstLevelFields && level === 1;

  return (
    <Fragment>
      {(!skipNonReferencedFields &&
        nonReferenceFields.map(item => {
          const { label, value } = item;
          const attachedParentNode = parentValue
            ? `${parentValue}.${value}`
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
        null}

      {(referenceFields &&
        referenceFields.map(item => {
          const { label, value, referenceTo } = item;

          return (
            <RefreshTreeElement
              {...props}
              key={label}
              level={level + 1}
              label={label}
              referenceTo={referenceTo}
              selectedParent={referenceTo}
              parentValue={value}
            />
          );
        })) ||
        null}
    </Fragment>
  );
}

export default function RefreshableTreeComponent(props) {
  const { connectionId, selectedParent, setSelectedValues } = props;
  const metaBasePath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/`;
  const [expanded, setExpanded] = useState([]);
  const dispatch = useDispatch();
  const statusSelector = useSelector(state => selectedParent =>
    selectors.metadataOptionsAndResources({
      state,
      connectionId,
      commMetaPath: `${metaBasePath}${selectedParent}`,
      filterKey: 'salesforce-sObjects-referenceFields',
    })
  );
  const onNodeToggle = (nodeId, expanded) => {
    // check for node id

    const referenceTo = nodeId.split(',')[1];
    const { status } = statusSelector(referenceTo);

    if (expanded) {
      if (status !== 'received')
        dispatch(
          actions.metadata.refresh(
            connectionId,
            `${metaBasePath}${referenceTo}`
          )
        );
      setExpanded(openNodes => [...openNodes, nodeId]);
    } else
      setExpanded(openNodes =>
        openNodes.filter(openNode => openNode !== nodeId)
      );
  };

  const [hasCalled, setHasCalled] = useState(false);

  useEffect(() => {
    if (!hasCalled && statusSelector(selectedParent) !== 'received')
      dispatch(
        actions.metadata.refresh(
          connectionId,
          `${metaBasePath}${selectedParent}`
        )
      );
    setHasCalled(true);
  }, [
    dispatch,
    connectionId,
    hasCalled,
    selectedParent,
    metaBasePath,
    statusSelector,
  ]);

  return (
    <TreeView
      expanded={expanded}
      onNodeToggle={onNodeToggle}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}>
      <TreeViewComponent
        setExpanded={setExpanded}
        {...props}
        setSelectedValues={setSelectedValues}
        metaBasePath={metaBasePath}
        expanded={expanded}
        level={1}
      />
    </TreeView>
  );
}
