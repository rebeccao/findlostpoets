import React from 'react';
import BaseModal from '~/components/modals/baseinfomodal';

interface ReleaseNotesModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const ReleaseNotesModal: React.FC<ReleaseNotesModalProps> = ({ onClose, isOpen }) => {
  return (
    <BaseModal onClose={onClose} title="Release Notes" isOpen={isOpen}>
      <div className="space-y-1">
        <h2 className="text-lg font-light">Release 1.0.0 - Major database update, new features, bug fixes</h2>
        <ul className="list-disc list-inside p-4">
          <li className="pl-2 mb-1 hanging-indent">
            <strong>Database major update:</strong> Migrated the latest Manifold LostPoets metadata into the findlostpoets database, resulting in two major updates: 
            <ol className="list-dash list-inside ml-8">
              <li>New origin names for Pak's 16 orphan Origins</li>
              <li>New Class trait for origin, poet and ghost</li>
            </ol>
          </li>
          <li className="pl-2 mb-1 hanging-indent">
            <strong>Search by Class:</strong> Allows for allowing multiple Class selections and for compound searching with other traits.
          </li>
          <li className="pl-2 mb-1 hanging-indent">
            <strong>Class labels added to Poets and Poet Details.</strong>
          </li>
          <li className="pl-2 mb-1 hanging-indent">
            <strong>Poet names modified:</strong> Database update also included new naming formats. Origins are now VIAK instead of Origin #VIAK, Ghosts are now #20046 instead of Poet #20046, and camel case instead of upper case for certain poets.
          </li>
          <li className="pl-2 mb-1 hanging-indent">
            <strong>Simplified database schema</strong>
          </li>
          <li className="pl-2 mb-1 hanging-indent">
            <strong>Prettied up fonts throughout</ strong>
          </li>
          <li className="pl-2 mb-1 hanging-indent">
            <strong>Bug fix:</strong> WIP. Poem on mobile devices, force poem to start at the top instead of the bottom.
          </li>
          <li className="pl-2 mb-1 hanging-indent">
            <strong>Bug fix:</strong> WIP After Clear Search, reset Range min/max inputs back to the placeholders.
          </li>
          <li className="pl-2 mb-1 hanging-indent">
            <strong>Bug fix:</strong> WIP Search by Trait removed the forcing of the conversion to a number when it should be string.
          </li>
        </ul>
      </div>
    </BaseModal>
  );
};

export default ReleaseNotesModal;
