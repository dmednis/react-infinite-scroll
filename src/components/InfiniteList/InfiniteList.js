import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './InfiniteList.css';

/**
 * InfiniteList
 *
 * A stateful React component that provides bi-directional infinite scrolling functionality for a list of elements.
 * Requires a list row component (rowComponent) and a data array (data) as props.
 * For each element of the data array a rowComponent is rendered in the list with the array element passed to the rowComponent as data prop.
 * Allows for configuration of max allowed items (maxItemsThreshold) in the list and top (topThreshold)
 * and bottom (bottomThreshold) thresholds for when to add more items at each end.
 */
export default class InfiniteList extends Component {

  static propTypes = {
    rowComponent: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    maxItemsThreshold: PropTypes.number,
    topThreshold: PropTypes.number,
    bottomThreshold: PropTypes.number,
  };


  static defaultProps = {
    maxItemsThreshold: 20,
    topThreshold: 3,
    bottomThreshold: 3,
  };


  constructor() {
    super();

    this.state = {
      rows: [],
      heightStack: [],
      topOffset: 0,
      bottomOffset: 0,
      topBuffer: 0,
      scrollRestorePosition: null,
      lastScrollPosition: 0,
    };
  }


  componentDidMount() {
    const { maxItemsThreshold, data } = this.props;
    this.setState({ bottomOffset: maxItemsThreshold, rows: data.slice(0, maxItemsThreshold) });
  }


  componentWillReceiveProps(nextProps) {
    const { maxItemsThreshold, data } = nextProps;
    this.setState({ rows: data.slice(0, maxItemsThreshold) });
  }


  componentDidUpdate() {
    const { scrollRestorePosition } = this.state;

    if (scrollRestorePosition !== null) {
      this.container.scrollTop = scrollRestorePosition;
      this.setState({ scrollRestorePosition: null })
    }
  }


  addTopItems(count) {
    const { data } = this.props;
    const { topOffset, rows, heightStack, topBuffer } = this.state;
    const newOffset = topOffset - count > 0 ? topOffset - count : 0;

    if (newOffset === topOffset) {
      return;
    }

    let addedHeight = 0;

    const heightStackSize = heightStack.length;
    for (let i = 0; i < count && i < heightStackSize; i++) {
      addedHeight += heightStack.pop();
    }

    this.setState({
      topOffset: newOffset,
      rows: [...data.slice(newOffset, newOffset + count), ...rows],
      heightStack: heightStack,
      topBuffer: topBuffer - addedHeight,
      scrollRestorePosition: this.container.scrollTop - 30,
    });
  }


  removeTopItems(count) {
    const elements = Array.from(this.container.children).slice(1);
    const { topOffset, rows, heightStack, topBuffer } = this.state;
    const newOffset = topOffset + count > 0 ? topOffset + count : 0;

    if (newOffset === topOffset) {
      return;
    }

    let removableHeight = 0;
    const newHeightStack = [];

    for (let i = 0; i < count && i < elements.length; i++) {
      const height = elements[i].getBoundingClientRect().height;
      removableHeight += height;
      newHeightStack.push(height);
    }

    this.setState({
      topOffset: newOffset,
      rows: rows.slice(count),
      heightStack: [...heightStack, ...newHeightStack],
      topBuffer: topBuffer + removableHeight,
      scrollRestorePosition: this.container.scrollTop + 10,
    });
  }


  addBottomItems(count) {
    const { data } = this.props;
    const { bottomOffset, rows } = this.state;
    const newOffset = bottomOffset + count > 0 ? bottomOffset + count : 0;


    this.setState({
      bottomOffset: newOffset,
      rows: [...rows, ...data.slice(bottomOffset, bottomOffset + count)],
    });
  }


  removeBottomItems(count) {
    const { bottomOffset, rows } = this.state;
    const newOffset = bottomOffset - count > 0 ? bottomOffset - count : 0;
    this.setState({
      bottomOffset: newOffset,
      rows: rows.slice(0, rows.length - count),
    });
  }


  handleScroll({ target }) {
    const { clientHeight, scrollTop } = target;
    const { topBuffer, lastScrollPosition, topOffset, rows } = this.state;
    const { topThreshold, bottomThreshold, maxItemsThreshold } = this.props;
    const elements = Array.from(this.container.children).slice(1);

    let topInvisibleElementsHeight = 0;
    let topInvisibleElementsCount = 0;
    let elementTotalHeight = 0;
    let bottomInvisibleElementsCount = 0;

    for (let i = 0; i < elements.length; i++) {
      const height = elements[i].getBoundingClientRect().height;
      if (scrollTop - topBuffer > topInvisibleElementsHeight + height) {
        topInvisibleElementsHeight += height;
        topInvisibleElementsCount++;
      }

      if (scrollTop - topBuffer + clientHeight < elementTotalHeight) {
        bottomInvisibleElementsCount++;
      }

      elementTotalHeight += height;
    }


    if (lastScrollPosition > scrollTop) {
      // SCROLL UP
      if (rows.length > maxItemsThreshold) {
        this.removeBottomItems(rows.length - maxItemsThreshold);
      }
      if (topInvisibleElementsCount < topThreshold && topOffset > 0) {
        this.addTopItems(topThreshold);
      }
    } else {
      // SCROLL DOWN
      if (rows.length > maxItemsThreshold) {
        this.removeTopItems(rows.length - maxItemsThreshold);
      }
      if (bottomInvisibleElementsCount < bottomThreshold) {
        this.addBottomItems(bottomThreshold);
      }
    }

    this.setState({ lastScrollPosition: scrollTop })
  }


  render() {

    const { rowComponent: Row } = this.props;
    const { topBuffer, rows } = this.state;


    const rowElements = rows.map((data, idx) => {
      return <Row data={data} key={idx}/>
    });

    return (
      <div onScroll={(e) => this.handleScroll(e)} ref={(container) => {
        this.container = container
      }} className="infinite-list-container">
        <div className="top-buffer" style={{ height: topBuffer }}/>
        {rowElements}
      </div>
    );
  }

}