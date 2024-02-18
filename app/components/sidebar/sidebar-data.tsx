export type ExpandedSidebarItem = {
  title?: string;  
  dbField: string;
  min?: number;
  max?: number;
}

export type SidebarItem = {
  title: string;
  type: 'search' | 'range' | 'checkbox';
  expandedSidebarItems: ExpandedSidebarItem[];
}

export const sidebarItems: SidebarItem[] = [
  {
    title: 'Poet Name',
    type: 'search',
    expandedSidebarItems: [
      { dbField: 'pNam' },   // Mongodb field name for Poet Name
    ]
  },
  {
    title: 'Origin',
    type: 'search',
    expandedSidebarItems: [
      { dbField: 'ori' }   // Mongodb field name for Origin
    ]
  },
  {
    title: 'Latent',
    type: 'search',
    expandedSidebarItems: [
      { dbField: 'lat' }   // Mongodb field name for Latent
    ]
  },
  {
    title: 'Rare Traits',
    type: 'checkbox',
    expandedSidebarItems: [
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
    expandedSidebarItems: [
      { dbField: 'prim',     // Mongodb field name for Word Count
        min: 2,
        max: 835399
      }
    ]
  },
  {
    title: 'Word Count',
    type: 'range', 
    expandedSidebarItems: [
      { dbField: 'wrdCnt',   // Mongodb field name for Word Count
        min: 2,
        max: 255
      }
    ]
  },
  {
    title: 'Lexicon',
    type: 'range', 
    expandedSidebarItems: [
      { dbField: 'lexCnt',   // Mongodb field name for Word Count
        min: 1,
        max: 255
      } 
    ]
  },
  {
    title: 'Rewrites',
    type: 'range', 
    expandedSidebarItems: [
      { dbField: 'rewrCnt',   // Mongodb field name for Word Count
        min: 1,
        max: 89
      }
    ]
  }
];
