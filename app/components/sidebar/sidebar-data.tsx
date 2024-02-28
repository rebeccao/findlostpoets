export type ExpandedSidebarItem = {
  title: string;  
  dbField: string;
  min?: string;
  max?: string;
}

export type SidebarItem = {
  title: string;
  details: string;
  type: 'traitSearch' | 'sort' | 'range' | 'oldTraitSearch' | 'oldsearch';
  expandedSidebarItems: ExpandedSidebarItem[];
}

export const sidebarItems: SidebarItem[] = [
  {
    title: 'Search By Trait',
    details: 'Dropdown provides the trait to search.',
    type: 'traitSearch',
    expandedSidebarItems: [
      { title: 'Poet Name', dbField: 'pNam' },   // Mongodb field name for Poet Name
      { title: 'Origin', dbField: 'ori' },
      { title: 'Latent', dbField: 'lat' },
      { title: 'Breed', dbField: 'brd' },   
      { title: 'Age', dbField: 'age' },
      { title: 'Genre', dbField: 'gen' },
      { title: 'Ego', dbField: 'ego' },
      { title: 'Polarity', dbField: 'pol' },
    ]
  },
  {
    title: 'Sort By Rare Trait',
    details: 'Returns Poets sorted by the rarest inascending order.',
    type: 'sort',
    expandedSidebarItems: [
      { title: 'Breed', dbField: 'brdCnt' },   // Mongodb field name for Breed
      { title: 'Age', dbField: 'ageCnt' },
      { title: 'Genre', dbField: 'genCnt' },
      //{ title: 'Polarity', dbField: 'polCnt' },
      { title: 'Ego', dbField: 'egoCnt' }
    ]
  },
  {
    title: 'Search By Ranges',
    details: 'Search by range.',
    type: 'range',
    expandedSidebarItems: [     
      { title: 'Lexicon', dbField: 'lexCnt', min: "1", max: "255" },        // Mongodb field name for Lexicon
      { title: 'Word Count', dbField: 'wrdCnt', min: "2", max: "255" }, 
      { title: 'Rewrites', dbField: 'rewrCnt', min: "1", max: "89" }, 
      { title: 'Prime Number', dbField: 'prim', min: "2", max: "835399" }, 
    ]
  },
];
