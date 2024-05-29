import React from 'react';
import BaseModal from '~/components/modals/baseinfomodal';

interface ReleaseNotesModalProps {
  onClose: () => void;
  backgroundColor: string;
  textColor: string;
}

const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({ onClose, backgroundColor, textColor }) => {
  return (
    <BaseModal onClose={onClose} title="About" backgroundColor={backgroundColor} textColor={textColor}>
      <p>
              
      </p>
    </BaseModal>
  );
};

export default ReleaseNotesModal;
