import classnames from 'classnames';
import {injectIntl} from 'react-intl';
import React from 'react';

import Action from './Action';
import Add from '../icons/Add';
import connectStores from '../../util/connectStores';
import EventTypes from '../../constants/EventTypes';
import Remove from '../icons/Remove';
import SettingsStore from '../../stores/SettingsStore';
import SortDropdown from './SortDropdown';
import StartIcon from '../icons/StartIcon';
import StopIcon from '../icons/StopIcon';
import TorrentActions from '../../actions/TorrentActions';
import TorrentStore from '../../stores/TorrentStore';
import UIActions from '../../actions/UIActions';
import HumbergerIcon from '../icons/HumbergerIcon';
import UIStore from '../../stores/UIStore';

class ActionBar extends React.Component {
  handleAddTorrents() {
    UIActions.displayModal({id: 'add-torrents'});
  }

  handleRemoveTorrents() {
    UIActions.displayModal({
      id: 'remove-torrents',
    });
  }

  handleSortChange(sortBy) {
    SettingsStore.saveFloodSettings({id: 'sortTorrents', data: sortBy});
    UIActions.setTorrentsSort(sortBy);
  }

  handleStart() {
    TorrentActions.startTorrents(TorrentStore.getSelectedTorrents());
  }

  handleStop() {
    TorrentActions.stopTorrents(TorrentStore.getSelectedTorrents());
  }

  toggleSideBar() {
    UIActions.toggleSideBar(!(UIStore.getSidebarVisibility()));
  }

  render() {
    const classes = classnames('action-bar', {
      'action-bar--is-condensed': this.props.torrentListViewSize === 'condensed',
    });

    return (
      <nav className={classes}>
        <div className="actions action-bar__item action-bar__item--humberger">
          <Action
            label={this.props.intl.formatMessage({
                id: 'actionbar.button.humberger',
                message: 'Toggle Sidebar',
              })}
            icon={<HumbergerIcon />}
            clickHandler={this.toggleSideBar}
          />
        </div>
        <div className="actions action-bar__item action-bar__item--sort-torrents">
          <SortDropdown
            direction={this.props.sortBy.direction}
            onSortChange={this.handleSortChange}
            selectedProperty={this.props.sortBy.property}
          />
        </div>
        <div className="actions action-bar__item action-bar__item--torrent-operations">
          <div className="action-bar__group">
            <Action
              label={this.props.intl.formatMessage({
                id: 'actionbar.button.start.torrent',
              })}
              slug="start-torrent"
              icon={<StartIcon />}
              clickHandler={this.handleStart}
            />
            <Action
              label={this.props.intl.formatMessage({
                id: 'actionbar.button.stop.torrent',
              })}
              slug="stop-torrent"
              icon={<StopIcon />}
              clickHandler={this.handleStop}
            />
          </div>
          <div className="action-bar__group action-bar__group--has-divider">
            <Action
              label={this.props.intl.formatMessage({
                id: 'actionbar.button.add.torrent',
              })}
              slug="add-torrent"
              icon={<Add />}
              clickHandler={this.handleAddTorrents}
            />
            <Action
              label={this.props.intl.formatMessage({
                id: 'actionbar.button.remove.torrent',
              })}
              slug="remove-torrent"
              icon={<Remove />}
              clickHandler={this.handleRemoveTorrents}
            />
          </div>
        </div>
      </nav>
    );
  }
}

const ConnectedActionBar = connectStores(injectIntl(ActionBar), () => {
  return [
    {
      store: SettingsStore,
      event: EventTypes.SETTINGS_CHANGE,
      getValue: ({store}) => {
        return {
          sortBy: store.getFloodSettings('sortTorrents'),
          torrentListViewSize: store.getFloodSettings('torrentListViewSize'),
          sidebarVisible: store.getFloodSettings('sidebarVisible'),
        };
      },
    },
  ];
});

export default ConnectedActionBar;
