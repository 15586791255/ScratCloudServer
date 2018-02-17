<template>
  <div>
    <div class="vux-demo">
      <img class="logo" src="../assets/vux_logo.png">
      <h1></h1>
    </div>
    <group title="">
      <cell title="商品管理" value="编辑" is-link :link="{path:'/shop_mgr'}"></cell>
    </group>
  </div>
</template>

<script>
  import {Group, Cell} from 'vux'

  export default {
    components: {
      Group,
      Cell
    },
    data () {
      return {
      }
    }
  }
</script>

<style>
  .vux-demo {
    text-align: center;
  }

  .logo {
    width: 100px;
    height: 100px
  }
</style>
