import GenerateZip from '../../components/GenerateZip';
import ModalDialog from '../../components/ModalDialog';

export default function GenerateZipModal(props) {
  const { onClose } = props;

  return (
    <ModalDialog show onClose={onClose} aria-labelledby="generate-template-zip">
      <div id="generate-template-zip">Generate Template Zip</div>
      <div>
        <GenerateZip onClose={onClose} />
      </div>
    </ModalDialog>
  );
}
