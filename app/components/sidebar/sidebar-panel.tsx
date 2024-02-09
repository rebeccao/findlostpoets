import { sidebarItems } from '~/components/sidebar/sidebar-data';
import SidebarRow from './sidebar-row';
import type { SearchCriteria } from '~/routes/_index';


interface SidebarPanelProps {
  onSelectionChange: (newCriteria: SearchCriteria) => void;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({ onSelectionChange }) => {
  console.log('SidebarPanel: received onSelectionChange');
  return (
    <>
      {sidebarItems.map((sidebarItem, index) => {
        return <SidebarRow sidebarItem={sidebarItem} key={index} onTermSelect={onSelectionChange} />
      })}
    </>
  );
};

export default SidebarPanel;
