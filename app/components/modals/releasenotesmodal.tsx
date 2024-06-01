import React from 'react';
import BaseModal from '~/components/modals/baseinfomodal';

interface ReleaseNotesModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({ onClose, isOpen }) => {
  return (
    <BaseModal onClose={onClose} title="Release Notes" isOpen={isOpen}>
      <p>
              
      </p>
    </BaseModal>
  );
};

export default ReleaseNotesModal;
