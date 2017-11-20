import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './InfiniteList.css';

export default class InfiniteList extends Component {

  static propTypes = {
    rowComponent: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    maxItems: PropTypes.number,
    threshold: PropTypes.number,
  };

  constructor() {
    super();

    this.itemCount = 20;

    this.state = {
      rows: [],
      heightStack: [],
      topOffset: 0,
      bottomOffset: this.itemCount,
      topBuffer: 0,
      scrollRestorePosition: null,
      lastScrollPosition: 0,
    };
  }


  componentDidMount() {
    this.container.addEventListener('scroll', this.handleScroll.bind(this));
    this.container.addEventListener('resize', this.handleScroll.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    const { data } = nextProps;

    this.setState({ rows: data.slice(0, this.itemCount) });
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
    const [_, ...elements] = this.container.children;
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
      scrollRestorePosition: this.container.scrollTop + 15,
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
    const { topBuffer, lastScrollPosition, topOffset } = this.state;
    const [_, ...rows] = this.container.children;

    let topInvisibleElementsHeight = 0;
    let topInvisibleElementsCount = 0;
    let elementTotalHeight = 0;
    let bottomInvisibleElementsCount = 0;

    for (let i = 0; i < rows.length; i++) {
      const height = rows[i].getBoundingClientRect().height;

      if (scrollTop - topBuffer > topInvisibleElementsHeight + height) {
        topInvisibleElementsHeight += height;
        topInvisibleElementsCount++;
      }

      if (scrollTop - topBuffer + clientHeight < elementTotalHeight) {
        bottomInvisibleElementsCount++;
      }

      elementTotalHeight += height;
    }


    if (lastScrollPosition > scrollTop || elementTotalHeight < clientHeight) {
      // SCROLL UP
      if (bottomInvisibleElementsCount > 2) {
        this.removeBottomItems(3);
      }
      if (topInvisibleElementsCount < 3 && topOffset > 0) {
        this.addTopItems(5);
      }
    } else {
      // SCROLL DOWN
      if (topInvisibleElementsCount > 5) {
        this.removeTopItems(3);
      }
      if (bottomInvisibleElementsCount < 3) {
        this.addBottomItems(5);
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
      <div>
        <div ref={(container) => {
          this.container = container
        }} className="infinite-list-container">
          <div className="top-buffer" style={{ height: topBuffer }}/>
          {rowElements}
        </div>
      </div>
    );
  }

}