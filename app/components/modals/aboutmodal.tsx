import React from 'react';
import { GoX } from "react-icons/go";
import { GrClose } from "react-icons/gr";

interface AboutModalProps {
  onClose: () => void;
  backgroundColor: string;
  textColor: string;
}

const AboutModal: React.FC<AboutModalProps> = ({ onClose, backgroundColor, textColor }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className={`p-10 rounded-xl shadow-lg w-[70vw] max-w-5xl h-3/4 overflow-y-auto ${backgroundColor} ${textColor}`}>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-medium">About</h2>
          <button onClick={onClose} aria-label="Close">
            <GrClose size={24} />
          </button>
        </div>
        <div className="space-y-4 font-extralight">
          <p>
            A couple years ago I decided to learn Python. I stumbled on a blog that used OpenSea's API to gather data about the MEEBIT collection. Naturally, I thought, "Why not do the same for LostPoets?" So, I dove in, collected all the OpenSea LostPoets Gen0 data, and created the spreadsheet. Initially, my grand strategy was to leverage this data to acquire the Poets with the rarest traits. But ultimately, I shared the spreadsheet with Pak's Discord group because I wanted to help those who shared my passion of finding Poets with rare traits.
          </p>
          <p>
            For the first year of LostPoets, two Origins were dropped daily. Names were given, poems were written, but OpenSea could not update the names in the Origin families unless a manual refresh was done. Frustrated, I found an unpublished OpenSea API and periodically used it to refresh the entire collection of 28,170 LostPoets. Hah!
          </p>
          <p>
          Then the night before the Gen1 release, I used the unpublished OpenSea Refresh API to refresh the entire collection and take one final snapshot of Gen0. Little did I know, this would be the last hurrah for Gen0 data on OpenSea. Poof! Just like that, the Gen0 image, the traits and the poems disappeared.
          </p>
          <p>
            To my surprise, my Python generated LostPoets spreadsheet became the sole keeper of Gen0 data. So then I added the Gen1 data using Manifold's API to create the master spreadsheet and on 22-Nov-22 the LostPoets master spreadsheet was frozen.
          </p>
          <p>
            Now, with this master source of LostPoets data in hand, I knew it needed to be visualized. I studied website frameworks and was amazed by how far UX/UI had evolved in the last decade. I decided on a framework and database. Then with the help of ChatGPT, FindLostPoets was born.
          </p>
          <p>
            So, here we are, with a visual collection of LostPoets data. Ready to be explored. Enjoy the journey of finding LostPoets!
          </p>
        </div>

      </div>
    </div>
  );
};

export default AboutModal;
