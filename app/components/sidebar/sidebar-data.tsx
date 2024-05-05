export type ExpandedSidebarItem = {
  title: string;  
  dbField: string;
  validationType?: 'alphanumeric' | 'alpha' | 'decimal' | 'fixedLength' | 'range' | 'enum';
  min?: string;
  max?: string;
  enumValues?: string[]; // For traits with specific allowable values
}

export type SidebarItem = {
  title: string;
  details: string;
  type: 'traitSearch' | 'sort' | 'range';
  expandedSidebarItems: ExpandedSidebarItem[];
}

export const sidebarItems: SidebarItem[] = [
  {
    title: 'Search By Trait',
    details: 'Choose the Search Trait from the dropdown below.',
    type: 'traitSearch',
    expandedSidebarItems: [
      { title: 'Poet Name', dbField: 'pNam', validationType: 'alphanumeric' },
      { title: 'Poet Number', dbField: 'pid', validationType: 'decimal', min: '1', max: '28170' },
      { title: 'Origin', dbField: 'ori', validationType: 'alphanumeric' },
      { title: 'Latent', dbField: 'lat', validationType: 'alphanumeric' },
      { title: 'Breed', dbField: 'brd', validationType: 'alpha' },
      { title: 'Age', dbField: 'age', validationType: 'decimal', min: '0.00', max: '1.00' },
      { title: 'Genre', dbField: 'gen', validationType: 'alpha' },
      { title: 'Ego', dbField: 'ego', validationType: 'enum', enumValues: ['I', 'II', 'III', 'IV', 'V', '1', '2', '3', '4', '5'] },
      { title: 'Polarity', dbField: 'pol', validationType: 'enum', enumValues: ['ka', 'qu'] },
    ]
  },
  {
    title: 'Sort By Rare Trait',
    details: 'Sort Poets by Rarity starting with the lowest trait count.',
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
    details: 'Search Poets by Range.',
    type: 'range',
    expandedSidebarItems: [     
      { title: 'Lexicon', dbField: 'lexCnt', min: "1", max: "255" },        // Mongodb field name for Lexicon
      { title: 'Word Count', dbField: 'wrdCnt', min: "2", max: "255" }, 
      { title: 'Rewrites', dbField: 'rewrCnt', min: "1", max: "89" }, 
      { title: 'Prime Number', dbField: 'prim', min: "2", max: "835399" }, 
    ]
  },
];
