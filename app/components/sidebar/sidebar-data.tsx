export type ExpandedSidebarItem = {
  title: string;  
  dbField: string;
  inputType: 'text' | 'number'; 
  validationType?: 'alphanumeric' | 'alpha' | 'decimal' | 'fixedLength' | 'range' | 'enum';
  min?: string;
  max?: string;
  enumValues?: string[]; // For traits with specific allowable values
}

export type SidebarItem = {
  title: string;
  details: string;
  type: 'traitSearch' | 'sort' | 'range' | 'class' | 'named';
  expandedSidebarItems: ExpandedSidebarItem[];
}

export const sidebarItems: SidebarItem[] = [
  {
    title: 'Search By Trait',
    details: 'Choose any Search Trait from the dropdown below and enter a search term.',
    type: 'traitSearch',
    expandedSidebarItems: [
      { title: 'Poet Name', dbField: 'pNam', inputType: 'text', validationType: 'alphanumeric' },
      { title: 'Origin', dbField: 'ori', inputType: 'text', validationType: 'alphanumeric' },
      { title: 'Latent', dbField: 'lat', inputType: 'text', validationType: 'alphanumeric' },
      { title: 'Breed', dbField: 'brd', inputType: 'text', validationType: 'alpha' },
      { title: 'Age', dbField: 'age', inputType: 'number', validationType: 'decimal', min: '0.00', max: '1.00' },
      { title: 'Genre', dbField: 'gen', inputType: 'text', validationType: 'alpha' },
      { title: 'Ego', dbField: 'ego', inputType: 'text', validationType: 'enum', enumValues: ['I', 'II', 'III', 'IV', 'V', 'i', 'ii', 'iii', 'iv', 'v', '1', '2', '3', '4', '5'] },
      { title: 'Owner', dbField: 'oNam', inputType: 'text', validationType: 'alphanumeric' },
      { title: 'Wallet', dbField: 'oAddr', inputType: 'text', validationType: 'alphanumeric' },
    ]
  },
  {
    title: 'Sort By Rarest',
    details: 'Select to sort by the rarest trait count. The trait count is displayed in the bottom left corner.',
    type: 'sort',
    expandedSidebarItems: [
      { title: 'Breed', dbField: 'brdCnt', inputType: 'number' },   // Mongodb field name for Breed
      { title: 'Age', dbField: 'ageCnt', inputType: 'number' },
      { title: 'Genre', dbField: 'genCnt', inputType: 'number' },
      { title: 'Ego', dbField: 'egoCnt', inputType: 'number' }
    ]
  },
  {
    title: 'Search By Ranges',
    details: 'Select checkbox and input numbers to search Poets by Range.',
    type: 'range',
    expandedSidebarItems: [     
      { title: 'Lexicon', dbField: 'lexCnt', inputType: 'number', min: "1", max: "255" },        // Mongodb field name for Lexicon
      { title: 'Word Count', dbField: 'wrdCnt', inputType: 'number', min: "2", max: "255" }, 
      { title: 'Rewrites', dbField: 'rewrCnt', inputType: 'number', min: "1", max: "89" }, 
      { title: 'Prime Number', dbField: 'prim', inputType: 'number', min: "2", max: "835399" }, 
      { title: 'Poet Number', dbField: 'pid', inputType: 'number', min: '1', max: '28170' },
    ]
  },
  {
    title: 'Search By Class',
    details: 'Click any combination.',
    type: 'class',
    expandedSidebarItems: [
      { title: 'Origin', dbField: 'origin', inputType: 'text' },   // Mongodb choices for class
      { title: 'Poet', dbField: 'poet', inputType: 'text' },
      { title: 'Ghost', dbField: 'ghost', inputType: 'text' },
    ]
  },
  {
    title: 'Search By Named',
    details: 'Click either to select or neither to display all.',
    type: 'named',
    expandedSidebarItems: [ 
      { title: 'Named', dbField: 'True', inputType: 'text' },     // Mongodb choices for named
      { title: 'No Name', dbField: 'False', inputType: 'text' }
    ]
  },
];
