import React, { Component } from 'react';
import PropTypes from 'prop-types';
import faker from 'faker';

export default class InfiniteScroll extends Component {

  static propTypes = {
    maxItems: PropTypes.number,
    threshold: PropTypes.number,
  };

  constructor() {
    super();
    this.state = {
      rawItems: [],
      items: [],
      offset: 0,
      lastScrollPosition: 0,
    };
  }

  componentDidMount() {

    const items = [];

    for (let i = 0; i < 100; i++) {
      items.push({
        heading: faker.lorem.sentence(),
        content: faker.lorem.paragraph()
      });
    }

    this.setState({ rawItems: items, items });

    this.container.addEventListener('scroll', this.handleScroll.bind(this));

  }

  componentDidUpdate() {
    this.handleScroll({target: this.container})
  }

  handleScroll({ target }) {
    const { scrollHeight, clientHeight, scrollTop, children } = target;
    const elements = children.length;
    const elementAvgHeight = scrollHeight / elements;
    const topScroll = scrollTop;
    const bottomScroll = scrollTop + clientHeight;
    const topBuffer = Math.round(topScroll / elementAvgHeight);
    const bottomBuffer = Math.round((scrollHeight - bottomScroll) / elementAvgHeight);
    console.log(topBuffer, bottomBuffer);

    if (topBuffer >= 20) {
      this.setState({ items: this.state.items.slice(15), offset: this.state.offset + 15 })
    }
  }

  render() {
    const containerStyle = {
      height: '500px',
      border: '1px solid blue',
      overflowY: 'scroll',
    };

    const itemStyle = {
      border: '1px solid red',
    };

    const { offset } = this.state;


    const rows = this.state.items.map((item, idx) => {
      return <div style={itemStyle} key={idx}>
        <h4>{item.heading} ({offset + idx + 1})</h4>
        <p>{item.content}</p>
      </div>
    });

    return (
      <div ref={(container) => {
        this.container = container
      }} style={containerStyle}>
        {rows}
      </div>
    );
  }

}