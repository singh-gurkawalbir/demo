import EditorDrawer from './Drawer';
import EditorModal from './Modal';

export default function EditorExpandMode(props) {
  const { expandMode = 'modal', show, ...rest } = props;

  // Handles showing either modal/drawer
  // Can remove this once we finish converting all modals into drawers
  return (
    show &&
    (expandMode === 'modal' ? (
      <EditorModal {...rest} />
    ) : (
      <EditorDrawer {...rest} />
    ))
  );
}
