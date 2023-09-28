/**
 * Copyright 2023 Moxun<mxnstrive@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import DictData from './DictData'
import { defineProperty, deleteProperties } from './util'
import { reactive } from 'vue'

const INNER = Symbol('inner')

/**
 * @classdesc 字典
 * @property {object} label  字典标签对象，内部属性名为字典值
 * @property {object} value  字典值对象，内部属性名为字典值
 * @property {array}  data   字典数据数组
 * @author Moxun <mxnstrive@gmail.com>
 */
export default class Dict {
/**
 * @classdesc 字典
 * @property {object} options 字典选项
 * @property {object} options.owner
 * @property {object} options.meta
 */
  constructor(options) {
    const inner = {
      owner: options.owner,
      label: Object.create(null),
      values: [],
      data: Object.create(null),
      meta: options.meta,
      loader: null,
    }

    inner.label.__d_ver = 1
    inner.data.__d_ver = 1
    inner.values.__d_ver = 1

    defineProperty(this, 'label', false, function() { return inner.label })
    defineProperty(this, 'values', false, function() { return inner.values })
    defineProperty(this, 'data', false, function() { return inner.data })

    // 将inner设置为响应式
    this[INNER] = reactive(inner)
  }

  get meta() {
    return this[INNER].meta
  }

  /**
   * 初始化
   * @returns Promise<Dict> 字典Promise
   */
  init() {
    if (this.meta.lazy) {
      return
    }
    return loadDict(this)
  }

  /**
   * 等待字典加载
   * @returns Promise<Dict> 字典Promise
   */
  wait() {
    const loader = this[INNER]._loader
    if (loader) {
      return loader.then(() => {
        return this
      })
    } else {
      return Promise.resolve(this)
    }
  }

  /**
   * 重新加载字典
   * @returns Promise<Dict> 字典Promise
   */
  reload() {
    if (this.meta === undefined) {
      return Promise.reject(new Error('the dict meta was not found'))
    }
    return loadDict(this)
  }

}

/**
 * 加载字典
 * @param {Dict} dict 字典
 * @returns {Promise}
 */
function loadDict(dict) {
  const dictMeta = dict.meta
  // 向上查找字典
  if (dictMeta.lookup) {
    const dt = lookupDict(dict[INNER].owner.$parent, dictMeta.type)
    if (dt) {
      return dt.wait()
        .then(dt => {
          fillDict(dict, dt.values, true)
          return dict
        })
    }
  }

  let loader = dictMeta.request(dictMeta)
  if (!(loader instanceof Promise)) {
    loader = Promise.resolve(loader)
  }
  dict[INNER]._loader = loader
  loader.finally(function () {
    dict[INNER]._loader = null
    return dict
  })
  return loader.then(response => {
    let data = dictMeta.responseConverter(response, dictMeta)
    if (!(data instanceof Array)) {
      console.error('the return of responseConverter must be Array<DictData>')
      data = []
    } else if (data.filter(d => d instanceof DictData).length !== data.length) {
      console.error('the type of elements in dicts must be DictData')
      data = []
    }
    fillDict(dict, data, true)
    return dict
  })
}

/**
 * 填充字典
 * @param {*} dict
 * @param {Array<DictData>} dataArray 字典数据数组
 * @param {boolean} doClear 清空字典
 */
function fillDict(dict, dataArray, doClear) {
  if (doClear) {
    clearDict(dict)
  }

  const { label, values, data } = dict[INNER]

  dataArray.forEach(d => {
    Object.defineProperty(label, d.value, {
      configurable: true,
      enumerable: true,
      get() { return d.label },
      set(val) { d.label = val },
    })

    Object.defineProperty(data, d.value, {
      configurable: true,
      enumerable: true,
      get() { return d },
    })
  })
  values.splice(0, Number.MAX_SAFE_INTEGER, ...dataArray)

  label.__d_ver += 1
  data.__d_ver += 1
  values.__d_ver += 1
}

/**
 * 清空字典数据
 */
function clearDict(dict) {
  const { label, values, data } = dict[INNER]
  deleteProperties(label)
  deleteProperties(data)
  values.splice(0, Number.MAX_SAFE_INTEGER)
}

/**
 * 向上查找Dict
 * @param {*} vm
 * @param {string} type
 */
function lookupDict(vm, type) {
  if (vm.dict) {
    const dt = vm.dict.dict[type]
    if (dt) {
      return dt
    }
  }
  return vm.$parent ? lookupDict(vm.$parent, type) : undefined
}
