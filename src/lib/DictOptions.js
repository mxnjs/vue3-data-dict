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
import { recursiveMerge } from './util'
import { convertData } from './DictConverter'

/**
 * 字典组件选项
 * @author Moxun <mxnstrive@gmail.com>
 */
export const options = {
  metas: {
    /**
     * 默认字典配置
     *
     * 其他任何类型字典均会与该配置进行差分，但具体类型字典的配置链优先
     * 指定type字典未匹配到配置信息时，将使用此默认配置
     */
    '*': {
      /**
       * 字典请求，方法签名为function(dictMeta: DictMeta): Promise | Array
       */
      request: (dictMeta) => {
        console.log(`load dict ${dictMeta.type}`)
        return Promise.resolve([])
      },
      /**
       * 字典响应数据转换器，方法签名为function(response: Object, dictMeta: DictMeta): DictData
       */
      responseConverter,
      /**
       * 字典标签字段
       */
      labelField: 'label',
      /**
       * 字典值字段
       */
      valueField: 'value',
      /**
       * 向上查找，开启后字典数据加载时，会优先从祖先组件中查找同类型字典
       */
      lookup: false,
    },
  },
  /**
   * 默认标签字段
   */
  DEFAULT_LABEL_FIELDS: ['label', 'name', 'title'],
  /**
   * 默认值字段
   */
  DEFAULT_VALUE_FIELDS: ['value', 'id', 'uid', 'key'],
}

/**
 * 映射字典
 * @param {Object} response 字典数据
 * @param {DictMeta} dictMeta 字典元数据
 * @returns {DictData}
 */
function responseConverter(response, dictMeta) {
  let dicts = null
  if (Object.prototype.toString.call(response) === '[object Array]') {
    dicts = response
  } else {
    dicts = [ response ]
  }
  if (dicts === null) {
    console.warn(`no dict data of "${dictMeta.type}" found in the response`)
    return []
  }
  return dicts.map(d => convertData(d, dictMeta))
}

/**
 * 递归合并选项
 * @param {object} src
 */
export function mergeOptions(src) {
  recursiveMerge(options, src)
}

export default options
