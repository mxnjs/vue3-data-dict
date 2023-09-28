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
import DataDict from './DataDict'
import { mergeOptions } from './DictOptions'

/**
 * 数据字典安装
 * @author Moxun <mxnstrive@gmail.com>
 */
export default function (app, options) {
  // 合并选项，将用户配置与内置设定融合
  mergeOptions(options)
  // 全局混入
  app.mixin({
    data() {
      // 未作dicts声明时，data中不加入dict
      if (!this.$options || this.$options.dicts === undefined || this.$options.dicts === null) {
        return {}
      }
      const dict = new DataDict({
        owner: this,
      })
      return {
        dict,
      }
    },
    created() {
      const dict = this.dict
      if (!(dict instanceof DataDict)) {
        return
      }
      // 全局onCreated钩子
      options.onCreated && options.onCreated(dict)
      dict.init(this.$options.dicts).then(() => {
        // 全局onReady钩子
        options.onReady && options.onReady(dict)
        this.$nextTick(() => {
          // 字典就绪事件
          this.$emit('dictReady', dict)
          // 调用组件methods中onDictReady方法
          if (this.$options.methods && this.$options.methods.onDictReady instanceof Function) {
            this.$options.methods.onDictReady.call(this, this.dict)
          }
        })
      })
    },
  })
}
