import { SidebarData } from '~/components/sidebar/sidebar-data';
import SidebarRow from '~/components/sidebar/sidebar-row';
import type { SearchCriteria } from '~/routes/_index';

interface SidebarPanelProps {
  onSelectionChange: (newCriteria: SearchCriteria) => void;
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({ onSelectionChange }) => {
  console.log('SidebarPanel: received onSelectionChange');
  return (
    <>
      {SidebarData.map((item, index) => {
        //console.log('Made it here too!', { index });
        return <SidebarRow item={item} key={index} onTermSelect={onSelectionChange} />;
      })}
    </>
  );
};

export default SidebarPanel;
