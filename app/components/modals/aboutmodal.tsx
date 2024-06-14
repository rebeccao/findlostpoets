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
        A couple of years ago, I decided to learn Python. I stumbled upon a blog that used OpenSea's API to gather data about another large NFT collection. Naturally, I thought, "Why not do the same for LostPoets?" So, I dove in, collected all the OpenSea LostPoets Gen0 data, and created a spreadsheet. Initially, my grand strategy was to leverage this data to acquire the Poets with the rarest traits. Ultimately, however, I shared the spreadsheet with Pak's Discord group because I wanted to help others who shared my passion for finding Poets with rare traits.
      </p>
      <p>
        For the first year of LostPoets, two Origins were dropped daily. Names were given, poems were written, but OpenSea could not update the names in the Origin families unless a manual refresh was done. Frustrated, I found an unpublished OpenSea API and periodically used it to refresh the entire collection of 28,170 LostPoets. Hah!
      </p>
      <p>
        Then, the night before the Gen1 release, I used the unpublished OpenSea Refresh API to refresh the entire collection and take one final snapshot of Gen0. Little did I know, this would be the last hurrah for Gen0 data on OpenSea. Poof! Just like that, the Gen0 images, traits, and poems disappeared. To my surprise, my Python-generated LostPoets spreadsheet became the sole keeper of Gen0 data.
      </p>
      <p>
        The Gen1 data on OpenSea included a new image; few traits remained, and a couple new traits were introduced. I wanted to include this data in my spreadsheet, so I used Manifold's API to download the Gen1 metadata. I merged it into the spreadsheet, and on 22-Nov-22 the LostPoets master spreadsheet was frozen.
      </p>
      <p>
        With this master source of LostPoets data in hand, I knew it needed to be visualized. I studied website frameworks and was amazed by how far UX/UI had evolved in the last decade. I decided on a framework and database. Then with the help of ChatGPT, FINDLOSTPOETS was born.
      </p>
      <p>
        One final migration of Manifold's Gen1 metadata and here we are, with a visual collection of this incredible data ready to be explored. Enjoy the journey of finding LostPoets!
      </p>
    </BaseModal>
  );
};

export default AboutModal;
