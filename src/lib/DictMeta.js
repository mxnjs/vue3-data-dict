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
import DictOptions from './DictOptions'
import { recursiveMerge } from './util'

/**
 * @classdesc 字典元数据
 * @property {String} type 类型
 * @property {Function} request 请求
 * @property {String} label 标签字段
 * @property {String} value 值字段
 * @author Moxun <mxnstrive@gmail.com>
 */
export default class DictMeta {
  constructor(options) {
    this.type = options.type
    this.request = options.request
    this.responseConverter = options.responseConverter
    this.labelField = options.labelField
    this.valueField = options.valueField
    this.lazy = options.lazy === true
    this.lookup = options.lookup === true
  }
}


/**
 * 解析字典元数据
 * @param {Object} options
 * @returns {DictMeta}
 * @author Moxun <mxnstrive@gmail.com>
 */
DictMeta.parse = function(options) {
  const opts = recursiveMerge({}, DictOptions.metas['*'])
  if (typeof options === 'string') {
    opts.type = options
    recursiveMerge(opts, DictOptions.metas[options])
  } else if (typeof options === 'object') {
    recursiveMerge(opts, DictOptions.metas[options.type], options)
  }
  return new DictMeta(opts)
}
