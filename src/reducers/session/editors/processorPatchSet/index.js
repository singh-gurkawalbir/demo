import transform from './transform';

const logicMap = {
  transform,
};

function getLogic(editor) {
  const logic = logicMap[editor.processorKey];

  if (!logic) {
    throw new Error(`Processor [${editor.processor}] not supported.`);
  }

  return logic;
}

const getPatchSet = editor => getLogic(editor).patchSet(editor);

export default {
  getPatchSet,
};
