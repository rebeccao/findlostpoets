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
        In 2022 I decided to learn Python. While exploring, I stumbled across a blog that used OpenSea’s API to pull data from a major NFT collection. I thought, "Why not do the same for LostPoets?" So, I dove in. I gathered all the OpenSea LostPoets data and built a spreadsheet. Initially, my grand scheme was to leverage this data to acquire the Poets with the rarest traits. But ultimately, I shared the spreadsheet with Pak's Discord group because I wanted to help others who shared my passion for finding Poets with rare traits.
      </p>
      <p>
        During LostPoets' first year, collectors fed Pages to their Poets to name them and to write their poems. One interesting feature was that when a collector named their Origin, it automatically updated the Origin trait for every Poet in that family. But there was a catch: OpenSea couldn’t update traits in real time. To see the new names, you had to manually refresh each Poet! Frustrated with this, I discovered an unpublished OpenSea API and used it to periodically refresh the entire collection of 28,170 LostPoets. Hah!
      </p>
      <p>
        Then, on November 1, 2022, Pak locked the ability to feed, name and write poems. LostPoets Gen0 was frozen. I used the unpublished OpenSea Refresh API one last time to capture a final snapshot of every Gen0 Poet. Little did I know this would be the last hurrah. Soon after, the Gen0 images, traits, and poems vanished from Opensea. And to my surprise, my Python-generated LostPoets spreadsheet became the sole surviving record of Gen0 LostPoets.
      </p>
      <p>
        The Gen1 data that emerged on OpenSea was different: new Gen1 images replaced the Gen0 images, most traits disappeared, and a few new ones appeared. Wanting to add this new Gen1 data in my spreadsheet, I used Manifold's API to download the Gen1 metadata and merged it into the spreadsheet. On November 22, 2022, the LostPoets master spreadsheet was officially frozen.
      </p>
      <p>
        With this master source of LostPoets data in hand, I knew it needed to be visualized. I studied website frameworks and was amazed by how far UX/UI design had evolved over the last decade. I decided on a framework and database. Then in June 2024, with the help of ChatGPT, FINDLOSTPOETS was born.
      </p>
      <p>
        So here we are, with a visual collection of this incredible data to explore. Enjoy the journey of finding LostPoets!
      </p>
    </BaseModal>
  );
};

export default AboutModal;
