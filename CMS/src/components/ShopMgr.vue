<template>
  <div>
    <x-header>商品管理</x-header>
    <group>
      <cell v-for="(typeName, typeKey) in shopType" :key="typeKey" :title="typeName" is-link :link="{path:'/shop_list', query:{tp: typeKey}}"></cell>
    </group>
  </div>
</template>

<script>
  import {Group, Cell, XHeader} from 'vux'

  export default {
    components: {
      Group,
      Cell,
      XHeader
    },
    data () {
      return {
        shopType: this.shopType
      }
    }
  }
</script>

<style>

</style>
