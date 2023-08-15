import React from 'react';
import * as RiIcons from 'react-icons/ri';

export const SidebarData = [
  {
    title: 'Poet Name',
    searchTerm: 'pNam',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      { type: 'search', title: 'search-bar' }
    ]
  },
  {
    title: 'Origin',
    searchTerm: 'ori',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      { type: 'search', title: 'search-bar' }
    ]
  },
  {
    title: 'Latent',
    searchTerm: 'lat',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      { type: 'search', title: 'search-bar' }
    ]
  },
  {
    title: 'Prime Number',
    searchTerm: 'prim',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      { type: 'range', title: 'search-bar' },
    ]
  },
  {
    title: 'Breed',
    searchTerm: 'brd',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      { type: 'checkbox', title: 'naren' },
      { type: 'checkbox', title: 'navi' },
      { type: 'checkbox', title: 'naxo' }
    ]
  },
  {
    title: 'Age',
    searchTerm: 'age',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      { type: 'checkbox', title: '0.00' },
      { type: 'checkbox', title: '0.02' },
      { type: 'checkbox', title: '0.05' }
    ]
  },
  {
    title: 'Genre',
    searchTerm: 'gen',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      { type: 'checkbox', title: 'aea' },
      { type: 'checkbox', title: 'aef' },
      { type: 'checkbox', title: 'aeh' }
    ]
  },
  {
    title: 'Polarity',
    searchTerm: 'pol',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      { type: 'checkbox', title: 'ka' },
      { type: 'checkbox', title: 'qu' }
    ]
  },
  {
    title: 'Ego',
    searchTerm: 'ego',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      { type: 'checkbox', title: 'I' },
      { type: 'checkbox', title: 'II' },
      { type: 'checkbox', title: 'III' }
    ]
  },
  {
    title: 'Word Count',
    searchTerm: 'wrdCnt',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      { type: 'range', title: '' }
    ]
  },
  {
    title: 'Lexicon',
    searchTerm: 'lexCnt',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      { type: 'range', title: '' }
    ]
  },
  {
    title: 'Rewrites',
    searchTerm: 'rewrCnt',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      { type: 'range', title: '' }
    ]
  }
];
