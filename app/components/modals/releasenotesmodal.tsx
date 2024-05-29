import React from 'react';
import BaseModal from '~/components/modals/baseinfomodal';

interface ReleaseNotesModalProps {
  onClose: () => void;
}

const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({ onClose }) => {
  return (
    <BaseModal onClose={onClose} title="About">
      <p>
              
      </p>
    </BaseModal>
  );
};

export default ReleaseNotesModal;
