import React from 'react';
import { SortableHandle } from 'react-sortable-hoc';
import GripperIcon from '../icons/GripperIcon';

const SortableDragHandle = ({className = ''}) => (<div className={className}><GripperIcon /></div>);

export default SortableHandle(SortableDragHandle);
