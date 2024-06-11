import React from 'react';
import BaseModal from '~/components/modals/baseinfomodal';
import { PiListMagnifyingGlassLight, PiListLight } from "react-icons/pi"; 

interface HelpModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose, isOpen }) => {
  return (
    <BaseModal onClose={onClose} title="Help" isOpen={isOpen}>
      <div className="mb-4">
        <div className="text-center">
          <span className="font-light text-xl">FINDLOSTPOETS</span>
        </div>
        <div className="text-center">
          Discover and explore poets from the Lostpoets NFT collection
        </div>
      </div>
      <div className="px-6">
        <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
          <h3 className="text-lg font-normal flex items-center">
            <PiListMagnifyingGlassLight size={34} className="mr-4 mb-2" /> Search
          </h3>
          <p>
            Click the Search icon to open and close the search panel. Here you can search poets by trait, trait rarities, trait ranges, class or named. Searches display poets in ascending order based on Poet Number. The count of the resulting poets for each search is displayed in the upper left corner of the page.  Combine multiple search selections to narrow the results even further.
          </p>
        </div>
        <div className="px-6">
          <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            <h4 className="text-md font-normal">Search By Trait</h4>
            <p>
              Choose the trait you want to search from the dropdown menu: Poet Name, Origin, Latent, Breed, Age, Genre, and Ego. Enter the trait name and hit Return or click the Search button. Examples:
            </p>
            <ul className="list-none list-inside m-4 mx-auto w-1/2">
              {[
                { label: "Poet Name", value: "#27081 or 27081. Selene or selene" },
                { label: "Origin", value: "EOS or eos" },
                { label: "Latent", value: "X5WF or x5wf" },
                { label: "Age", value: "0.35 or .35" },
                { label: "Ego", value: "II or ii or 2" },
              ].map((item, index) => (
                <li key={index} className="flex">
                  <span className="font-light w-28">{item.label}</span>
                  <span className="flex-1 text-left">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            <h4 className="text-md font-normal mb-2">Search By Rarest</h4>
            <p className="mb-2">
              Select the checkbox for any of the four traits (Breed, Age, Genre, and Ego) and click the Search button. The poets are displayed starting with the rarest poets for the selected trait. Example of searching by Breed rarities:
            </p>
            <ul className="list-none list-inside m-2 pl-4">
              <li><span className="font-normal">Breed:</span> iazee (1), zeeia (1), naia (2), zeevi (2), iana (4), nato (6), ...</li>
            </ul>
            <p className="mb-4">
              Poets displayed: One poet with Breed iazee, one poet with Breed zeeia, two poets with Breed naia, etc. The Breed count (or rarity) for each Breed name is displayed at the bottom left of each image card.
            </p>
          </div>
          <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            <h4 className="text-md font-normal mb-2">Search By Ranges</h4>
            <p className="mb-4">
              Select the checkbox, enter the range in the minimium and maximum input fields and click the Search button. The input fields default with placeholders of minimum and maximum values. If nothing is entered, the search will be performed on the default placeholder value. <span className="font-normal">Important:</span> You must select the checkbox before you click the Search button to activate the range search.
            </p>
          </div>
          <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            <h4 className="text-md font-normal mb-2">Search By Class</h4>
            <p className="mb-4">
            Select one or more of the three checkboxes (Origin, Poet, and Ghost), then click the Search button.
            </p>
          </div>
          <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            <h4 className="text-md font-normal mb-2">Search By Named</h4>
            <p className="mb-4">
            Select either Named or No Name, then click the Search button. Named poets include all Origins and poets that have been named. No Name poets are all the poets that have not been named. Note: poets with no name can have words! 
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
