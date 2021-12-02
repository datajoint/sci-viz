import React from "react";

interface SortButtonProps {
  attributeName: string;
  buttonName: string;
  setOrders: (Order: string) => void;
}

interface SortButtonState {
  sort: number;
  mode: string;
}

export default class SortButton extends React.Component<
  SortButtonProps,
  SortButtonState
> {
  constructor(props: SortButtonProps) {
    super(props);
    this.state = {
      sort: 1,
      mode: "",
    };
    this.changeSort = this.changeSort.bind(this);
  }

  changeSort() {
    if (this.state.sort % 3 === 0) {
      this.props.setOrders(this.props.attributeName + " del");
      this.setState({ mode: "" });
    } else if (this.state.sort % 3 === 1) {
      this.props.setOrders(this.props.attributeName + " ASC");
      this.setState({ mode: "⇑" });
    } else if (this.state.sort % 3 === 2) {
      this.props.setOrders(this.props.attributeName + " DESC");
      this.setState({ mode: "⇓" });
    }
    var newSort = this.state.sort + 1;
    this.setState({ sort: newSort });
  }

  render() {
    return (
      <button
        className={this.props.buttonName}
        onClick={() => this.changeSort()}
      >
        {this.props.attributeName} {this.state.mode}
      </button>
    );
  }
}
