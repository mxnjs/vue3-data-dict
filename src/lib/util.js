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

/**
 * 删除对象内枚举属性
 * @param {object} target
 * @author Moxun <mxnstrive@gmail.com>
 */
export function deleteProperties(target) {
  for(let k in target) {
    if (k == '__d_ver') {
      continue
    }
    delete target[k]
  }
}

/**
 *
 * @param {object} obj
 * @param {boolean} configurable
 * @param {string} prop
 * @param {function} getter
 * @param {function} setter
 */
export function defineProperty(obj, prop, configurable, getter, setter) {
  Object.defineProperty(obj, prop, {
    configurable,
    enumerable: true,
    get: getter,
    set: setter,
  })
}

/**
 * 串行递归合并，后者覆盖前者
 * @param {object} dst
 * @param {array} srcs
 * @returns dst
 */
export function recursiveMerge(dst, ...srcs) {
  srcs.forEach(function(src) {
    merge(dst, src)
  })
  return dst
}

/**
 * 递归合并
 * @param {object} dst
 * @param {object} src
 * @returns dst
 */
function merge(dst, src) {
  for (let k in src) {
    if (dst[k] === null || dst[k] === undefined) {
      dst[k] = src[k]
    }
    if (Object.prototype.toString.call(dst[k]) === '[object Object]') {
      recursiveMerge(dst[k], src[k])
    } else {
      dst[k] = src[k]
    }
  }
  return dst
}
