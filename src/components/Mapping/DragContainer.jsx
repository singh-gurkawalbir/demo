import React, { useCallback, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import {selectors} from '../../reducers';
import MappingRow from './MappingRow';
import actions from '../../actions';

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  ...draggableStyle,
  opacity: isDragging ? 0.6 : 1,

});
export default function DragContainer({ onDrop, disabled, className, ...props }) {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const mappings = useSelector(state => selectors.mapping(state).mappings);
  const onDragEnd = useCallback(result => {
    if (result.destination) {
      dispatch(actions.mapping.shiftOrder(result.draggableId, result.destination.index));
    }
    setIsDragging(false);
  }, [dispatch]);
  const handleDragStart = () => {
    setIsDragging(true);
  };
  const emptyRowIndex = mappings.length;

  return (
      <DragDropContext onDragStart={handleDragStart} onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" isDragDisabled={disabled}>
          {provided => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}>
              {mappings.map((mapping, index) => (
                <Draggable key={mapping.key} draggableId={mapping.key} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                      >
                      <MappingRow
                        index={index}
                        key={mapping.key}
                        mappingKey={mapping.key}
                        disabled={disabled}
                        isDragInProgress={isDragging}
                        {...props}
                        />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <Droppable droppableId="droppable2" isDragDisabled isDropDisabled>
          {provided => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}>
              <MappingRow
                key={`newMappingRow-${emptyRowIndex}`}
                index={emptyRowIndex}
                disabled={disabled}
                {...props}
              />
            </div>
          )}
        </Droppable>
      </DragDropContext>
  );
}
