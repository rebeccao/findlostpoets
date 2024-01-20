import type { ReactElement } from 'react';
import { BiSolidChevronDown, BiSolidChevronUp } from "react-icons/bi";

export type SubNavItem = {
  type: 'search' | 'range' | 'checkbox';
  title?: string;  
  name: string;
  value?: string;  
}

export type SidebarItem = {
  title: string;
  iconClosed: ReactElement;
  iconOpened: ReactElement;
  subNav: SubNavItem[];
}

export const SidebarData: SidebarItem[] = [
  {
    title: 'Poet Name',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'search', name: 'pNam' }
    ]
  },
  {
    title: 'Origin',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'search', name: 'ori' }
    ]
  },
  {
    title: 'Latent',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'search', name: 'lat' }
    ]
  },
  {
    title: 'Prime Number',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'range', name: 'prim' },
    ]
  },
  {
    title: 'Rare Traits',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'checkbox', title: 'Breed', name: 'orderBy', value: 'brdCnt' },
      { type: 'checkbox', title: 'Age', name: 'orderBy', value: 'ageCnt' },
      { type: 'checkbox', title: 'Genre', name: 'orderBy', value: 'genCnt' },
      { type: 'checkbox', title: 'Polarity', name: 'orderBy', value: 'polCnt' },
      { type: 'checkbox', title: 'Ego', name: 'orderBy', value: 'egoCnt' }
    ]
  },
  {
    title: 'Word Count',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'range', name: 'wrdCnt' }
    ]
  },
  {
    title: 'Lexicon',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'range', name: 'lexCnt' }
    ]
  },
  {
    title: 'Rewrites',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'range', name: 'rewrCnt' }
    ]
  }
];
