import React from 'react';
import { mount } from 'enzyme';

import InfiniteList from './InfiniteList';


describe("<InfiniteList/>", () => {

  const TestRow = ({id}) => {
    return <div className="list-element">{id}</div>
  };

  const defaultTestData = [];
  for(let i = 0; i < 40; i++) {
    defaultTestData.push({id: i});
  }


  it('renders without crashing', () => {
    const data = [];
    const component = mount(<InfiniteList rowComponent={TestRow} data={data}/>);
  });


  it('renders list elements with default threshold of 20', () => {
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData}/>);
    expect(component.find('.list-element').length).toBe(20);
  });


  it('renders list elements with custom threshold', () => {
    const customThreshold = 10;
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData} maxItemsThreshold={customThreshold}/>);
    expect(component.find('.list-element').length).toBe(customThreshold);
  });


  it('handles scroll events', () => {
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData} />);
    const spy = jest.spyOn(component.instance(), 'handleScroll');
    component.simulate('scroll');
    expect(spy).toHaveBeenCalled();
  });


  it('adds elements at the bottom of list when threshold reached (default threshold)', () => {
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData} maxItemsThreshold={10}/>);
    const children = component.getDOMNode().children;

    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      child.getBoundingClientRect = () => {
        return { height: 10 }
      }
    }

    const spy = jest.spyOn(component.instance(), 'addBottomItems');
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 20} });
    expect(spy).toHaveBeenCalled();
  });


  it('doesn\'t add elements at the bottom of list when threshold has not been reached (default threshold)', () => {
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData} maxItemsThreshold={10}/>);
    const children = component.getDOMNode().children;

    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      child.getBoundingClientRect = () => {
        return { height: 10 }
      }
    }

    const spy = jest.spyOn(component.instance(), 'addBottomItems');
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 19} });
    expect(spy).not.toHaveBeenCalled();
  });


  it('adds elements at the bottom of list when threshold reached (custom threshold)', () => {
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData} maxItemsThreshold={10} bottomThreshold={5}/>);
    const children = component.getDOMNode().children;

    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      child.getBoundingClientRect = () => {
        return { height: 10 }
      }
    }

    const spy = jest.spyOn(component.instance(), 'addBottomItems');
    component.simulate('scroll', {target: {clientHeight: 30, scrollTop: 20} });
    expect(spy).toHaveBeenCalled();
  });


  it('doesn\'t add elements at the bottom of list when threshold has not been reached (custom threshold)', () => {
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData} maxItemsThreshold={10} bottomThreshold={5}/>);
    const children = component.getDOMNode().children;

    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      child.getBoundingClientRect = () => {
        return { height: 10 }
      }
    }

    const spy = jest.spyOn(component.instance(), 'addBottomItems');
    component.simulate('scroll', {target: {clientHeight: 30, scrollTop: 19} });
    expect(spy).not.toHaveBeenCalled();
  });


  it('remove elements from the top of list when threshold reached (default threshold)', () => {
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData}/>);
    const children = component.getDOMNode().children;

    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      child.getBoundingClientRect = () => {
        return { height: 10 }
      }
    }

    const spy = jest.spyOn(component.instance(), 'removeTopItems');
    component.simulate('scroll', {target: {clientHeight: 100, scrollTop: 70} });
    component.simulate('scroll', {target: {clientHeight: 100, scrollTop: 70} });
    expect(spy).toHaveBeenCalled();
  });


  it('doesn\'t remove elements from the top of list when threshold has not been reached (default threshold)', () => {
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData}/>);
    const children = component.getDOMNode().children;

    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      child.getBoundingClientRect = () => {
        return { height: 10 }
      }
    }

    const spy = jest.spyOn(component.instance(), 'removeTopItems');
    component.simulate('scroll', {target: {clientHeight: 100, scrollTop: 69} });
    component.simulate('scroll', {target: {clientHeight: 100, scrollTop: 69} });
    expect(spy).not.toHaveBeenCalled();
  });


  it('remove elements from the top of list when threshold reached (custom threshold)', () => {
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData}  maxItemsThreshold={10}/>);
    const children = component.getDOMNode().children;

    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      child.getBoundingClientRect = () => {
        return { height: 10 }
      }
    }

    const spy = jest.spyOn(component.instance(), 'removeTopItems');
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 20} });
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 20} });
    expect(spy).toHaveBeenCalled();
  });


  it('doesn\'t remove elements from the top of list when threshold has not been reached (custom threshold)', () => {
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData} maxItemsThreshold={10}/>);
    const children = component.getDOMNode().children;

    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      child.getBoundingClientRect = () => {
        return { height: 10 }
      }
    }

    const spy = jest.spyOn(component.instance(), 'removeTopItems');
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 19} });
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 19} });
    expect(spy).not.toHaveBeenCalled();
  });


  it('remove elements from the bottom of list when threshold reached (custom threshold)', () => {
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData}  maxItemsThreshold={10}/>);
    const children = component.getDOMNode().children;

    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      child.getBoundingClientRect = () => {
        return { height: 10 }
      }
    }

    const spy = jest.spyOn(component.instance(), 'removeBottomItems');
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 20} });
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 18} });
    expect(spy).toHaveBeenCalled();
  });


  it('doesn\'t remove elements from the bottom of list when threshold has not been reached (custom threshold)', () => {
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData} maxItemsThreshold={10}/>);
    const children = component.getDOMNode().children;

    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      child.getBoundingClientRect = () => {
        return { height: 10 }
      }
    }

    const spy = jest.spyOn(component.instance(), 'removeBottomItems');
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 19} });
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 18} });
    expect(spy).not.toHaveBeenCalled();
  });


  it('add elements at the top of list when threshold reached (default threshold)', () => {
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData}  maxItemsThreshold={10}/>);
    const children = component.getDOMNode().children;

    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      child.getBoundingClientRect = () => {
        return { height: 10 }
      }
    }

    const spy = jest.spyOn(component.instance(), 'addTopItems');
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 20} });
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 20} });
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 19} });
    expect(spy).toHaveBeenCalled();
  });


  it('doesn\'t add elements at the top of list when threshold has not been reached (default threshold)', () => {
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData} maxItemsThreshold={10}/>);
    const children = component.getDOMNode().children;

    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      child.getBoundingClientRect = () => {
        return { height: 10 }
      }
    }

    const spy = jest.spyOn(component.instance(), 'addTopItems');
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 19} });
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 19} });
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 18} });
    expect(spy).not.toHaveBeenCalled();
  });


  it('add elements at the top of list when threshold reached (custom threshold)', () => {
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData}  maxItemsThreshold={10} topThreshold={5}/>);
    const children = component.getDOMNode().children;

    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      child.getBoundingClientRect = () => {
        return { height: 10 }
      }
    }

    const spy = jest.spyOn(component.instance(), 'addTopItems');
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 50} });
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 50} });
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 30} });
    expect(spy).toHaveBeenCalled();
  });


  it('doesn\'t add elements at the top of list when threshold has not been reached (custom threshold)', () => {
    const component = mount(<InfiniteList rowComponent={TestRow} data={defaultTestData} maxItemsThreshold={10} topThreshold={5}/>);
    const children = component.getDOMNode().children;

    for(let i = 0; i < children.length; i++) {
      const child = children[i];
      child.getBoundingClientRect = () => {
        return { height: 10 }
      }
    }

    const spy = jest.spyOn(component.instance(), 'addTopItems');
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 50} });
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 50} });
    component.simulate('scroll', {target: {clientHeight: 50, scrollTop: 31} });
    expect(spy).not.toHaveBeenCalled();
  });
});