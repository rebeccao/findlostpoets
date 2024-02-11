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
      { dbField: 'pNam' },   // Mongodb field name for Poet Name
    ]
  },
  {
    title: 'Origin',
    type: 'search',
    sidebarItemExpanded: [
      { dbField: 'ori' }   // Mongodb field name for Origin
    ]
  },
  {
    title: 'Latent',
    type: 'search',
    sidebarItemExpanded: [
      { dbField: 'lat' }   // Mongodb field name for Latent
    ]
  },
  {
    title: 'Rare Traits',
    type: 'checkbox',
    sidebarItemExpanded: [
      { title: 'Breed', dbField: 'brdCnt' },   // Mongodb field name for Breed
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
      { dbField: 'prim' },   // Mongodb field name for Prime Number
    ]
  },
  {
    title: 'Word Count',
    type: 'range', 
    sidebarItemExpanded: [
      { dbField: 'wrdCnt' }   // Mongodb field name for Word Count
    ]
  },
  {
    title: 'Lexicon',
    type: 'range', 
    sidebarItemExpanded: [
      { dbField: 'lexCnt' }   // Mongodb field name for Lexicon
    ]
  },
  {
    title: 'Rewrites',
    type: 'range', 
    sidebarItemExpanded: [
      { dbField: 'rewrCnt' }   // Mongodb field name for Rewrites
    ]
  }
];
