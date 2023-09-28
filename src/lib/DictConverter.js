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
import DictData from './DictData'

/**
 * 将字典原始数据转化为DictMeta类型
 * @param {object} data 字典原始数据
 * @param {DictMeta} dictMeta 字典元数据
 * @returns 字典内部DictMeta类型数据
 * @author Moxun <mxnstrive@gmail.com>
 */
export function convertData(data, dictMeta) {
  const label = determineDictField(data, dictMeta.labelField, ...DictOptions.DEFAULT_LABEL_FIELDS)
  const value = determineDictField(data, dictMeta.valueField, ...DictOptions.DEFAULT_VALUE_FIELDS)
  return new DictData(data[label], data[value], data)
}

/**
 * 确定字典字段
 * @param {DictData} dict
 * @param  {...String} fields
 */
function determineDictField(dict, ...fields) {
  return fields.find(f => Object.prototype.hasOwnProperty.call(dict, f))
}
