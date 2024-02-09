export type SidebarItemExpanded = {
  title?: string;  
  dbField: string;  
}

export type SidebarItem = {
  title: string;
  type: 'search' | 'range' | 'checkbox';
  sidebarItemExpanded: SidebarItemExpanded[];
}

export const sidebarItems: SidebarItem[] = [
  {
    title: 'Poet Name',
    type: 'search',
    sidebarItemExpanded: [
      { dbField: 'pNam' }, 
    ]
  },
  {
    title: 'Origin',
    type: 'search',
    sidebarItemExpanded: [
      { dbField: 'ori' }
    ]
  },
  {
    title: 'Latent',
    type: 'search',
    sidebarItemExpanded: [
      { dbField: 'lat' }
    ]
  },
  {
    title: 'Rare Traits',
    type: 'checkbox',
    sidebarItemExpanded: [
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
    sidebarItemExpanded: [
      { dbField: 'prim' },
    ]
  },
  {
    title: 'Word Count',
    type: 'range', 
    sidebarItemExpanded: [
      { dbField: 'wrdCnt' }
    ]
  },
  {
    title: 'Lexicon',
    type: 'range', 
    sidebarItemExpanded: [
      { dbField: 'lexCnt' }
    ]
  },
  {
    title: 'Rewrites',
    type: 'range', 
    sidebarItemExpanded: [
      { dbField: 'rewrCnt' }
    ]
  }
];
