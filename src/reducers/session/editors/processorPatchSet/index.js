import transform from './transform';
import scriptEdit from './scriptEdit';
import postResponseMapHook from './postResponseMapHook';

const logicMap = {
  transform,
  scriptEdit,
  postResponseMapHook,
};

function getLogic(editor) {
  const { processorKey } = (editor && editor.optionalSaveParams) || {};

  if (!processorKey) {
    throw new Error(`Not supported.`);
  }

  const logic = logicMap[processorKey];

  if (!logic) {
    throw new Error(`Processor [${processorKey}] not supported.`);
  }

  return logic;
}

const getPatchSet = editor => getLogic(editor).patchSet(editor);

export default {
  getPatchSet,
};
