export type SubNavItem = {
  title?: string;  
  dbField: string;  
}

export type SidebarItem = {
  title: string;
  type: 'search' | 'range' | 'checkbox';
  subNav: SubNavItem[];
}

export const SidebarData: SidebarItem[] = [
  {
    title: 'Poet Name',
    type: 'search',
    subNav: [
      { dbField: 'pNam' }, 
    ]
  },
  {
    title: 'Origin',
    type: 'search',
    subNav: [
      { dbField: 'ori' }
    ]
  },
  {
    title: 'Latent',
    type: 'search',
    subNav: [
      { dbField: 'lat' }
    ]
  },
  {
    title: 'Rare Traits',
    type: 'checkbox',
    subNav: [
      { title: 'Breed', dbField: 'brdCnt' },
      { title: 'Age', dbField: 'ageCnt' },
      { title: 'Genre', dbField: 'genCnt' },
      { title: 'Polarity', dbField: 'polCnt' },
      { title: 'Ego', dbField: 'egoCnt' }
    ]
  },
  {
    title: 'Prime Number',
    type: 'range', 
    subNav: [
      { dbField: 'prim' },
    ]
  },
  {
    title: 'Word Count',
    type: 'range', 
    subNav: [
      { dbField: 'wrdCnt' }
    ]
  },
  {
    title: 'Lexicon',
    type: 'range', 
    subNav: [
      { dbField: 'lexCnt' }
    ]
  },
  {
    title: 'Rewrites',
    type: 'range', 
    subNav: [
      { dbField: 'rewrCnt' }
    ]
  }
];
