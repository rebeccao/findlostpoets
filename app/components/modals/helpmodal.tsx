import React from 'react';
import BaseModal from '~/components/modals/baseinfomodal';
import { PiListMagnifyingGlassLight, PiListLight, PiCaretDownBold } from "react-icons/pi"; 

interface HelpModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose, isOpen }) => {
  return (
    <BaseModal onClose={onClose} title="Help" isOpen={isOpen}>
      <div className="px-6">
        <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
          <h3 className="text-lg font-normal flex items-center">
            <PiListMagnifyingGlassLight size={34} className="mr-4 mb-2" /> Search Icon
          </h3>
          <p>
            Click the Search icon to open and close the search panel. Here you can search Lost Poets by trait, trait rarities, trait ranges, class or named. Searches display Lost Poets in ascending order based on Poet Number. The count of the resulting Lost Poets for each search is displayed in the upper left corner of the page. Combine multiple search selections to narrow the results even further.
          </p>
        </div>
        <div className="px-6">
          <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            <h4 className="text-md font-normal">Search By Trait</h4>
            <p>
              Choose the trait you want to search from the dropdown menu: Poet Name, Origin, Latent, Breed, Age, Genre, Ego, Owner and Wallet. Enter the trait information and hit Return or click the Search Button. Note: Upper or lower case may be used. Examples:
            </p>
            <ul className="list-none list-inside m-4 mx-auto w-2/3">
              {[
                { label: "Poet Name", value: "#27081 or 27081. Selene or selene" },
                { label: "Origin", value: "EOS or eos" },
                { label: "Latent", value: "X5WF or x5wf" },
                { label: "Age", value: "0.35 or .35" },
                { label: "Ego", value: "II or ii or 2" },
                { label: "Owner", value: "0xNosToca or 0xnostoca" },
                { label: "Wallet", value: "0xe31c0a63b4509ede74a80cbe75b8f93b2d3b0ae9" },
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
              Select the checkbox for any of the four traits (Breed, Age, Genre, and Ego) and click the Search Button. The Lost Poets are displayed starting with the rarest Lost Poets for the selected trait. Example of searching by Breed rarities:
            </p>
            <ul className="list-none list-inside m-2 pl-4">
              <li><span className="font-normal">Breed:</span> iazee (1), zeeia (1), naia (2), zeevi (2), iana (4), nato (6), ...</li>
            </ul>
            <p className="mb-4">
            Lost Poets displayed: One Lost Poet with Breed iazee, one Lost Poet with Breed zeeia, two Lost Poets with Breed naia, etc. The Breed count (or rarity) for each Breed name is displayed at the bottom left of each image card.
            </p>
          </div>
          <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            <h4 className="text-md font-normal mb-2">Search By Ranges</h4>
            <p className="mb-4">
              Select the checkbox, enter the range in the minimium and maximum input fields and click the Search Button. The input fields default with placeholders of minimum and maximum values. If nothing is entered, the search will be performed on the default placeholder value. <span className="font-normal">Important:</span> You must select the checkbox before you click the Search Button to activate the range search.
            </p>
          </div>
          <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            <h4 className="text-md font-normal mb-2">Search By Class</h4>
            <p className="mb-4">
            Select one or more of the three checkboxes (Origin, Poet, and Ghost), then click the Search Button.
            </p>
          </div>
          <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            <h4 className="text-md font-normal mb-2">Search By Named</h4>
            <p className="mb-4">
            Select either Named or No Name, then click the Search Button. Named Lost Poets include all Origins and Lost Poets that have been named. No Name Lost Poets are all the Lost Poets that have not been named. Note: Lost Poets with no name can have words! 
            </p>
          </div>
          <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
          <h4 className="text-md font-normal mb-2">Buttons</h4>
            <p>
            <span className="font-light">Search Button: </span>Performs the search.
            </p>
            <p className="mb-4">
            <span className="font-light">Clear Button: </span>Clears the search and displays Lost Poets from a random place in the database.
            </p>
          </div>
        </div>
      </div>
      <div className="px-6">
      <div className="flex items-center" style={{ marginTop: '0.25rem', marginBottom: '.5rem' }}>
        <div className="flex flex-col items-center">
          <div className="text-xs mt-2 font-[LeagueSpartan-Light]">
            TOP 200+
          </div>
          <div className="text-xs -mt-1 font-[LeagueSpartan-Light]">
            COLLECTORS
          </div>
          <PiCaretDownBold size={10} className="cursor-pointer text-pearlwhite -mt-" />
        </div>
        <div className="ml-3 text-lg font-normal">
          Top Collectors Pulldown
        </div>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <p>
          Displays a list of the top 200+ collectors. This list may extend beyound 200 in order to include all the collectors for the Poet Count at the 200th collector. For instance, if the Poet Count of the 200th ranked collector is 20, then all collectors who own 20 Poets will be included extending the collector count beyound 200. For each collector:
        </p>
        <ul className="list-none list-inside m-4 mx-auto w-2/3">
          {[
            { label: "Rank", value: "Ranking of collector starting with the top collector." },
            { label: "Owner", value: "Opensea account name if it exists." },
            { label: "Wallet", value: "Wallet that holds the Lost Poets." },
            { label: "Poet Count", value: "Number of Lost Poets held by the Owner/Wallet." },
            { label: "Word Count", value: "Total Word Count of all the poets for that Owner/Wallet." },
            { label: "Lexicon", value: "Total Lexicon of all the poets for that Owner/Wallet." },
          ].map((item, index) => (
            <li key={index} className="flex">
              <span className="font-light w-28">{item.label}</span>
              <span className="flex-1 text-left">{item.value}</span>
            </li>
          ))}
        </ul>
        <p>
          The Poet Count, Word Count and Lexicon are sortable in descending order by clicking the ↓ in the header.  
        </p>
        <br></br>
        <p>
          Every row in the Top Collectors list is selectable and will initiate a search of that collector's Lost Poets. In addition to the Search By Traits in the Sidebar Panel, this provides a another way to search by collectors. The collector's Lost Poets can be further refined by rarities, word counts, etc.
        </p>
      </div>
      </div>
      <div className="px-6">
        <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
          <h3 className="text-lg font-normal flex items-center">
            <PiListLight size={34} className="mr-4 mb-2" /> Information Icon
          </h3>
          <p>
            The Information icon opens and closes a dropdown of different information: 
          </p>
          <ul className="list-none list-inside m-4 mx-auto w-2/3">
            {[
              { label: "Help", value: "" },
              { label: "About", value: "" },
              { label: "Release Notes", value: "" },
              { label: "Release Number", value: "" },
            ].map((item, index) => (
              <li key={index} className="flex">
                <span className="font-light w-35">{item.label}</span>
                <span className="flex-1 text-left">{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="px-6">
        <div style={{ marginTop: '0.25rem', marginBottom: '1.5rem' }}>
          <h3 className="text-lg font-normal mb-2">Lost Poet Details Page</h3>
          <ol className="list-dash list-inside hanging-indent ml-8">
              <li>Click any Lost Poet to display its details: larger Gen 0 and Gen 1 images, the Lost Poet's traits, and the poem if one exists.</li>
              <li>Some poems are large and run off the bottom of the screen. Click the large poem to show its full view on half of the display. It can be dragged around on the display.</li>
              <li>Copy the Lost Poet's URL and share it on Discord and Twitter.</li>
            </ol>
          </div>
      </div>
    </BaseModal>
  );
};

export default HelpModal;
