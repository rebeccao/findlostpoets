import React from 'react';
import BaseModal from '~/components/modals/baseinfomodal';
import { PiListMagnifyingGlassLight, PiListLight } from "react-icons/pi"; 

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <BaseModal onClose={onClose} title="Help">
      <p className="mb-4">
      <span className="font-light text-xl">FINDLOSTPOETS</span> lets you discover poets from Murat Pak's Lostpoets NFT collection and explore their details.
      </p>
      <div className="px-6">
        <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
          <h3 className="text-lg font-normal flex items-center">
            <PiListMagnifyingGlassLight size={34} className="mr-4 mb-2" /> Search
          </h3>
          <p>
            Click the Search icon to open the search panel. Here you can set up searches to search poets by trait, sort poets by rarest traits, and search poets by trait ranges.
          </p>
        </div>
        <div className="px-6">
          <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            <h4 className="text-md font-normal">Search By Trait</h4>
            <p>
              Select the trait you want to search from the dropdown menu (Origin, Latent, Poet Name, Breed, Age, Genre, and Ego). Enter the trait name and press Enter or click the Search button. The poets matching the selected trait's name will be displayed along with the total count for that trait. Examples:
            </p>
            <ul className="list-none list-inside mb-4 pl-4">
              <li className="flex items-center"><span className="font-normal w-24">Origin</span><span>NQTW</span></li>
              <li className="flex items-center"><span className="font-normal w-24">Latent</span><span>GBRB</span></li>
              <li className="flex items-center"><span className="font-normal w-24">Age</span><span>0.35</span></li>
            </ul>
          </div>
          <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            <h4 className="text-md font-normal mb-2">Search By Rarest</h4>
            <p className="mb-2">
              Select the checkbox for any of the four traits (Breed, Age, Genre, and Ego) and click the Search button. The poets will be displayed starting with the rarest poets for the selected trait. Example of searching by Breed rarities:
            </p>
            <ul className="list-none list-inside mb-2 pl-4">
              <li><strong>Breed:</strong> iazee (1), zeeia (1), naia (2), zeevi (2), iana (4), nato (6), ...</li>
            </ul>
            <p className="mb-4">
              Poets displayed: One poet with Breed iazee, one poet with Breed zeeia, two poets with Breed naia, etc. The count for each Breed name is displayed at the bottom left.
            </p>
          </div>
          <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            <h4 className="text-md font-normal mb-2">Search By Ranges</h4>
            <p className="mb-4">
              Select the checkbox for any of the Range items, enter the range, and click the Search button. Note: The range inputs are populated with the minimum and maximum values for each range item and will perform the search on that value if nothing is entered.
            </p>
          </div>
          <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
          <h4 className="text-md font-normal mb-2">Buttons</h4>
            <p>
            <span className="font-light">Search button: </span>Performs the search.
            </p>
            <p className="mb-4">
            <span className="font-light">Clear button: </span>Clears the search and displays poets from a random place in the database.
            </p>
          </div>
        </div>
        <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
          <h3 className="text-lg font-normal mb-2">Poet Details</h3>
          <p className="mb-4">
            Click any poet to display details, including larger images, the poet's traits, and the poet's poem (if one exists). Some poems are large and can be clicked to show a full view of the poem, which can be moved around on the screen.
          </p>
          </div>
      </div>
    </BaseModal>
  );
};

export default HelpModal;
