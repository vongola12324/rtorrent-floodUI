import React from 'react';

import {FormElementAddon, FormRow, FormRowGroup, Textbox} from '../../../ui';
import AddMini from '../../icons/AddMini';
import RemoveMini from '../../icons/RemoveMini';

export default class TextboxRepeater extends React.PureComponent {
  idCounter = 0;

  constructor(props) {
    super(props);
    this.state = {
      textboxes: this.props.defaultValues || [{id: 0, value: ''}],
    };
  }

  getID() {
    return ++this.idCounter;
  }

  getTextboxes = () =>
    this.state.textboxes.map((textbox, index) => {
      let removeButton = null;

      if (index > 0) {
        removeButton = (
          <FormElementAddon
            onClick={() => {
              this.handleTextboxRemove(index);
            }}>
            <RemoveMini size="mini" />
          </FormElementAddon>
        );
      }

      return (
        <FormRow key={textbox.id}>
          <Textbox
            addonPlacement="after"
            id={`${this.props.id}-${textbox.id}`}
            defaultValue={textbox.value}
            label={index === 0 && this.props.label}
            placeholder={this.props.placeholder}
            wrapperClassName="textbox-repeater">
            <FormElementAddon
              onClick={() => {
                this.handleTextboxAdd(index);
              }}>
              <AddMini size="mini" />
            </FormElementAddon>
            {removeButton}
          </Textbox>
        </FormRow>
      );
    });

  handleTextboxAdd = (index) => {
    this.setState((state) => {
      const textboxes = Object.assign([], state.textboxes);
      textboxes.splice(index + 1, 0, {id: this.getID(), value: ''});
      return {textboxes};
    });
  };

  handleTextboxRemove = (index) => {
    this.setState((state) => {
      const textboxes = Object.assign([], state.textboxes);
      textboxes.splice(index, 1);
      return {textboxes};
    });
  };

  render() {
    return <FormRowGroup>{this.getTextboxes()}</FormRowGroup>;
  }
}
