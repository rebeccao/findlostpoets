import React from 'react';
import { BiSolidChevronDown, BiSolidChevronUp } from "react-icons/bi";

export const SidebarData = [
  {
    title: 'Poet Name',
    searchTerm: 'pNam',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'search', title: 'search-bar' }
    ]
  },
  {
    title: 'Origin',
    searchTerm: 'ori',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'search', title: 'search-bar' }
    ]
  },
  {
    title: 'Latent',
    searchTerm: 'lat',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'search', title: 'search-bar' }
    ]
  },
  {
    title: 'Prime Number',
    searchTerm: 'prim',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'range', title: 'search-bar' },
    ]
  },
  {
    title: 'Breed',
    searchTerm: 'brd',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'checkbox', title: 'naren' },
      { type: 'checkbox', title: 'navi' },
      { type: 'checkbox', title: 'naxo' }
    ]
  },
  {
    title: 'Age',
    searchTerm: 'age',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'checkbox', title: '0.00' },
      { type: 'checkbox', title: '0.02' },
      { type: 'checkbox', title: '0.05' }
    ]
  },
  {
    title: 'Genre',
    searchTerm: 'gen',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'checkbox', title: 'aea' },
      { type: 'checkbox', title: 'aef' },
      { type: 'checkbox', title: 'aeh' }
    ]
  },
  {
    title: 'Polarity',
    searchTerm: 'pol',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'checkbox', title: 'ka' },
      { type: 'checkbox', title: 'qu' }
    ]
  },
  {
    title: 'Ego',
    searchTerm: 'ego',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'checkbox', title: 'I' },
      { type: 'checkbox', title: 'II' },
      { type: 'checkbox', title: 'III' }
    ]
  },
  {
    title: 'Word Count',
    searchTerm: 'wrdCnt',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'range', title: '' }
    ]
  },
  {
    title: 'Lexicon',
    searchTerm: 'lexCnt',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'range', title: '' }
    ]
  },
  {
    title: 'Rewrites',
    searchTerm: 'rewrCnt',
    iconClosed: <BiSolidChevronDown />,
    iconOpened: <BiSolidChevronUp />,

    subNav: [
      { type: 'range', title: '' }
    ]
  }
];
