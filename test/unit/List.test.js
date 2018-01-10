import List from '../../src/List.vue'
import Vue from 'vue'
import {expect} from 'chai'

describe('List.vue', () => {
  it('display items from the list', () => {
    const Constructor = Vue.extend(List)
    const ListComponent = new Constructor().$mount()
    expect(ListComponent.$el.textContent).to.contain('play games')

  });
  it('adds a new item to list on click', () => {
    // build component
    const Constructor = Vue.extend(List);
    const ListComponent = new Constructor().$mount();

    // set value of new item
    ListComponent.newItem = 'brush my teeth';

    const button = ListComponent.$el.querySelector('button')
    const clickEvt = new window.Event('click')

    button.dispatchEvent(clickEvt)
    ListComponent._watcher.run()

    //assert list contains new item
    expect(ListComponent.$el.textContent).to.contain('brush my teeth');
    expect(ListComponent.listItems).to.contain('brush my teeth');

  })
})