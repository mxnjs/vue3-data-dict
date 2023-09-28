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
import DictMeta from './DictMeta'
import Dict from './Dict'
import { recursiveMerge, defineProperty } from './util'

const DEFAULT_DICT_OPTIONS = {
  types: [],
}

const INNER = Symbol('inner')

/**
 * @classdesc 数据字典
 * @property {object} owner  字典所属组件实例
 * @property {object} data   数据对象，内部属性名为字典类型值
 * @property {object} dict   字典对象，内部属性名为字典类型值
 * @property {object} label  标签对象，内部属性名为字典类型值
 * @property {object} values 值对象，内部属性名为字典类型值
 * @property {object} *Dict  具体字典对象，属性名为"字典类型值+Dict"
 * @author Moxun <mxnstrive@gmail.com>
 */
export default class DataDict {
  constructor(options) {
    this[INNER] = {
      owner: options.owner,
      data: Object.create(null),
      dict: Object.create(null),
      label: Object.create(null),
      values: Object.create(null),
    }
  }

  /**
   * 所有者
   */
  get owner() {
    return this[INNER].owner
  }

  /**
   * 字典标签对象，内部属性名为字典类型值
   */
  get label() {
    return this[INNER].label
  }

  /**
   * 字典值对象，内部属性名为字典类型值
   */
  get values() {
    return this[INNER].values
  }

  /**
   * 字典数据对象，内部属性名为字典类型值
   */
  get data() {
    return this[INNER].data
  }

  /**
   * 字典对象，内部属性名为字典类型值
   */
  get dict() {
    return this[INNER].dict
  }

  /**
   * 初始化
   * @param {*} options
   * @returns
   */
  init(options) {
    if (options instanceof Array) {
      options = { types: options }
    }

    const opts = recursiveMerge({}, DEFAULT_DICT_OPTIONS, options)
    const ps = opts.types.map(t => this.register(t))
    return Promise.all(ps)
  }

  /**
   * 注册字典
   * @param {object} options 字典选项
   */
  register(options) {
    const dictMeta = DictMeta.parse(options)
    const type = dictMeta.type
    let dt = this.dict[type]
    if (dt) {
      return dt
    }
    dt = new Dict({
      owner: this.owner,
      meta: dictMeta,
    })

    defineProperty(this.label, type, false, function() { return dt.label })
    defineProperty(this.values, type, false, function() { return dt.values })
    defineProperty(this.data, type, false, function() { return dt.data })
    defineProperty(this.dict, type, false, function() { return dt })
    defineProperty(this, type + 'Dict', false, function() { return dt })

    dt.init()

    return dt
  }

  /**
   * 等待字典加载
   * @param {string} type 字典类型值
   * @returns Promise<Dict> 字典Promise
   */
  wait(type) {
    const { dt, reject } = findDictOrReject(this, type)
    return reject ? reject : dt.wait()
  }

  /**
   * 重新加载字典
   * @param {string} type 字典类型值
   * @returns Promise<Dict> 字典Promise
   */
  reload(type) {
    const { dt, reject } = findDictOrReject(this, type)
    return reject ? reject : dt.reload()
  }

}

/**
 * 查找字典
 * @param {Dict} dict 字典
 * @param {string} type 字典类型
 * @returns {object} result
 * @returns {object} result.dt 字典
 * @returns {Promise<Error>} result.reject 未找到时reject Promise
 */
function findDictOrReject(dict, type) {
  const dt = dict.dict[type]
  return {
    dt,
    reject: dt ? null : Promise.reject(new Error(`the dict of "${type}" type was not found.`)),
  }
}
