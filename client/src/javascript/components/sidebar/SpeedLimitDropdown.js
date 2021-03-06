import _ from 'lodash';
import {defineMessages, FormattedMessage, injectIntl} from 'react-intl';
import React from 'react';

import ClientActions from '../../actions/ClientActions';
import connectStores from '../../util/connectStores';
import Dropdown from '../general/form-elements/Dropdown';
import EventTypes from '../../constants/EventTypes';
import LimitsIcon from '../icons/Limits';
import SettingsStore from '../../stores/SettingsStore';
import Size from '../general/Size';
import Tooltip from '../general/Tooltip';
import TransferDataStore from '../../stores/TransferDataStore';

const MESSAGES = defineMessages({
  speedLimits: {
    id: 'sidebar.button.speedlimits',
  },
  download: {
    id: 'sidebar.speedlimits.download',
  },
  upload: {
    id: 'sidebar.speedlimits.upload',
  },
  unlimited: {
    id: 'speed.unlimited',
  },
});

class SpeedLimitDropdown extends React.Component {
  tooltipRef = null;

  getDropdownHeader() {
    return (
      <button
        className="sidebar__icon-button sidebar__icon-button--interactive
        sidebar__icon-button--limits"
        title={this.props.intl.formatMessage(MESSAGES.speedLimits)}>
        <LimitsIcon />
        <FormattedMessage {...MESSAGES.speedLimits} />
      </button>
    );
  }

  getDropdownTrigger() {
    const label = this.props.intl.formatMessage(MESSAGES.speedLimits);

    return (
      <Tooltip
        content={label}
        position="bottom"
        ref={(node) => {
          this.tooltipRef = node;
        }}
        wrapperClassName="sidebar__icon-button tooltip__wrapper">
        <LimitsIcon />
      </Tooltip>
    );
  }

  getHumanReadableSpeed(bytes) {
    if (bytes === 0) {
      return this.props.intl.formatMessage(MESSAGES.unlimited);
    }
    return <Size value={bytes} isSpeed precision={1} />;
  }

  getSpeedList(property) {
    const heading = {
      className: `dropdown__label dropdown__label--${property}`,
      ...(property === 'download'
        ? {displayName: this.props.intl.formatMessage(MESSAGES.download)}
        : {displayName: this.props.intl.formatMessage(MESSAGES.upload)}),
      selectable: false,
      value: null,
    };

    let insertCurrentThrottle = true;
    const currentThrottle = this.props.currentThrottles;
    const speeds = this.props.speedLimits[property];

    const items = speeds.map((bytes) => {
      let selected = false;
      bytes = Number(bytes);

      // Check if the current throttle setting exists in the preset speeds list.
      // Determine if we need to add the current throttle setting to the menu.
      if (currentThrottle && currentThrottle[property] === bytes) {
        selected = true;
        insertCurrentThrottle = false;
      }

      return {
        displayName: this.getHumanReadableSpeed(bytes),
        property,
        selected,
        selectable: true,
        value: bytes,
      };
    });

    // If the current throttle setting doesn't exist in the pre-set speeds list,
    // add it and show it as selected.
    if (insertCurrentThrottle && currentThrottle) {
      // Find the position to insert the current throttle setting so that it
      // remains sorted from lowest to highest.
      const insertionPoint = _.sortedIndex(speeds, currentThrottle[property]);

      items.splice(insertionPoint, 0, {
        displayName: this.getHumanReadableSpeed(currentThrottle[property]),
        property,
        selected: true,
        selectable: true,
        value: currentThrottle[property],
      });
    }

    items.unshift(heading);

    return items;
  }

  getDropdownMenus() {
    return [this.getSpeedList('download'), this.getSpeedList('upload')];
  }

  handleDropdownOpen = () => {
    this.tooltipRef.dismissTooltip();
  };

  handleItemSelect(data) {
    ClientActions.setThrottle(data.property, data.value);
  }

  render() {
    return (
      <Dropdown
        dropdownWrapperClass="dropdown dropdown--speed-limits sidebar__action"
        handleItemSelect={this.handleItemSelect}
        header={this.getDropdownHeader()}
        menuItems={this.getDropdownMenus()}
        onOpen={this.handleDropdownOpen}
        trigger={this.getDropdownTrigger()}
      />
    );
  }
}

const ConnectedSpeedLimitDropdown = connectStores(injectIntl(SpeedLimitDropdown), () => {
  return [
    {
      store: SettingsStore,
      event: EventTypes.SETTINGS_CHANGE,
      getValue: ({store}) => {
        return {
          speedLimits: store.getFloodSettings('speedLimits'),
        };
      },
    },
    {
      store: TransferDataStore,
      event: EventTypes.CLIENT_TRANSFER_SUMMARY_CHANGE,
      getValue: ({store}) => {
        const transferSummary = store.getTransferSummary();

        return {
          currentThrottles: {
            upload: transferSummary.upThrottle,
            download: transferSummary.downThrottle,
          },
        };
      },
    },
  ];
});

export default ConnectedSpeedLimitDropdown;
