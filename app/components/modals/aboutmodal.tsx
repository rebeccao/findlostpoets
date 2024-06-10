import React from 'react';
import BaseModal from '~/components/modals/baseinfomodal';

interface AboutModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose, isOpen }) => {
  return (
    <BaseModal onClose={onClose} title="About" isOpen={isOpen}>
      <p>
        A couple years ago I decided to learn Python. I stumbled on a blog that used OpenSea's API to gather data about another large NFT collection. Naturally, I thought, "Why not do the same for LostPoets?" So, I dove in, collected all the OpenSea LostPoets Gen0 data, and created the spreadsheet. Initially, my grand strategy was to leverage this data to acquire the Poets with the rarest traits. But ultimately, I shared the spreadsheet with Pak's Discord group because I wanted to help those who shared my passion of finding Poets with rare traits.
      </p>
      <p>
        For the first year of LostPoets, two Origins were dropped daily. Names were given, poems were written, but OpenSea could not update the names in the Origin families unless a manual refresh was done. Frustrated, I found an unpublished OpenSea API and periodically used it to refresh the entire collection of 28,170 LostPoets. Hah!
      </p>
      <p>
        Then the night before the Gen1 release, I used the unpublished OpenSea Refresh API to refresh the entire collection and take one final snapshot of Gen0. Little did I know, this would be the last hurrah for Gen0 data on OpenSea. Poof! Just like that. The Gen0 images, the traits and the poems disappeared. To my surprise, my Python generated LostPoets spreadsheet became the sole keeper of Gen0 data. 
      </p>
      <p>
        Gen1 data replaced Gen0 with a new image; few traits remained and a couple new traits introduced. I wanted to add Gen1 to my spreadsheet, so I used Manifold's API to download the Gen1 metadata and merge it into the spreadsheet. On 22-Nov-22, the LostPoets master spreadsheet was frozen.
      </p>
      <p>
        Now, with this master source of LostPoets data in hand, I knew it needed to be visualized. I studied website frameworks and was amazed by how far UX/UI had evolved in the last decade. I decided on a framework and database. Then with the help of ChatGPT, FindLostPoets was born.
      </p>
      <p>
        So, here we are, with a visual collection of this incredible data ready to be explored. Enjoy the journey of finding LostPoets!
      </p>
    </BaseModal>
  );
};

export default AboutModal;
