# Data dict for Vue3

## Installation

```js
npm i vue3-data-dict -S
```

## Examples

### install 

```vue
import { createApp, type Component } from 'vue'
import App from './App.vue'
import VueDataDict from 'vue3-data-dict'

const app = createApp(App)

app.use(VueDataDict, {
  onCreated(dict) {
    console.log('dict created: %o', dict)
  },
  onReady(dict) {
    console.log('dict ready: %o', dict)
  },
  metas: {
    '*': {
      request(dictMeta) {
        return Promise // get data from remote server
      },
      responseConverter(response, dictMeta) {
        // you can use "VueDataDict.convertData({ ... }, dictMeta)" to convert Object to DictData
        return response.map(e => VueDataDict.convertData(e, dictMeta))
      }
    }
  }
})

app.mount('#app')
```

### use 

```vue
<template>
  <div>
    <div v-for="item in dict.dict.dict1" :key="item.value">
      {{ item.label }}
    </div>
  </div>
</template>

<script>
export default {
  dicts: [
    'dict1', // only type name
    { // full dict meta
      type: 'dict2',
      lazy: true, // lazy load
      request(dictMeta) { // get dict2's data
        ...
        return Promise
      },
      responseConverter(response, dictMeta) {
        ...
        return [] // Array<DictData>
      })
    }],
  methods: {
    onDictReady(dict) {
      // dict ready event
    },
    toLoadDict() {
      this.dict.reload('dict2').then(dict => {
        // do something
      })
    },
    toRegisterDict() {
      this.dict.register('dict3').then(dict => {
        // do something
      })
    },
    toWaitDict() {
      this.dict.wait('dict1').then(dict => {
        // do something
      })
    },
  }
}
</script>
```

## Licence

This repository is licensed under the [Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/) license.
