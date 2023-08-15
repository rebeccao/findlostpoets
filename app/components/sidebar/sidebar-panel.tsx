import { SidebarData } from '~/components/sidebar/sidebar-data';
import SidebarRow from '~/components/sidebar/sidebar-row';

const SidebarPanel = () => {
  return (
    <>
      <h2>Search</h2>
      {SidebarData.map((item, index) => {
        console.log('Made it here too!', { index });
        return <SidebarRow item={item} key={index} />;
      })}
    </>
  );
};

export default SidebarPanel;
