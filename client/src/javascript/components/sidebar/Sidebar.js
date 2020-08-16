import React from 'react';
import ClientStats from './TransferData';
import CustomScrollbars from '../general/CustomScrollbars';
import FeedsButton from './FeedsButton';
import LogoutButton from './LogoutButton';
import NotificationsButton from './NotificationsButton';
import SearchTorrents from './SearchTorrents';
import SettingsButton from './SettingsButton';
import SidebarActions from './SidebarActions';
import SpeedLimitDropdown from './SpeedLimitDropdown';
import StatusFilters from './StatusFilters';
import TagFilters from './TagFilters';
import TrackerFilters from './TrackerFilters';
import DiskUsage from './DiskUsage';
import UIStore from '../../stores/UIStore';
import ReactSidebar from "react-sidebar";
import UIActions from '../../actions/UIActions';
import EventTypes from '../../constants/EventTypes';

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarOpen: UIStore.getSidebarVisibility(),
    };
    this.setState = this.setState.bind(this);
  }

  componentDidMount() {
    UIStore.listen(EventTypes.UI_CLICK_HUMBERGER, this.setState);  
  }

  componentWillUnmount() {
    UIStore.unlisten(EventTypes.UI_CLICK_HUMBERGER, this.setState);  
  }

  setState() {
    this.state = {
      sidebarOpen: UIStore.getSidebarVisibility()
    };
    console.log(this.state.sidebarOpen);
  }

  render() {
    const sidebar = (
    <CustomScrollbars className="application__sidebar" inverted>
      <SidebarActions>
        <SpeedLimitDropdown />
        <SettingsButton />
        <FeedsButton />
        <NotificationsButton />
        <LogoutButton />
      </SidebarActions>
      <ClientStats />
      <SearchTorrents />
      <StatusFilters />
      <TagFilters />
      <TrackerFilters />
      <DiskUsage />
    </CustomScrollbars>
    );

    const sidebarProps = {
      sidebar,
      open: this.state.sidebarOpen,
      onSetOpen: UIActions.toggleSideBar(!(UIStore.getSidebarVisibility())),
    }
    
    return (
      <ReactSidebar {...sidebarProps}>
        <div></div>
      </ReactSidebar>
    );
  }
}

export default SideBar;