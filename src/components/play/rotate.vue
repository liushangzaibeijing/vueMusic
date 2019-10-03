<template>
  <div class="rotate-container">
    <img class="needle" src="http://on99ebnkk.bkt.clouddn.com/play_needle.png" :class="isPlaying ? 'playing' : 'pause'">
    <div class="disk-bg">
      <div class="disk" :class="isPlaying ? 'playing' : 'pause'">
        <div>
          <img :src="imgUrl" class="song-img">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 *  A moudle that define rotate component
 *  @exports vRotate
 *  @author oyh(Reusjs)
 */
export default {
  name: 'vRotate',
  props: {
    imgUrl: {
        type: String,
        default: ''
    },
  },
  data() {
    return {
      imgUrl: ''
    }
  },
  mounted() {
    this.$emit('getImgUrl', this.imgUrl)
  },
  computed: {
    nowPlayIndex() {
      return this.$store.state.nowPlayIndex;
      //this.$store.state.musicList.musicData[this.$store.state.nowPlayIndex] && this.$store.state.musicList.musicData[this.$store.state.nowPlayIndex].id
    },
    isPlaying() {
      return this.$store.state.isPlaying
    }
  },
  watch: {
    id: {
        nowPlayIndex(newVal) {
        if (!newVal) return
        this.$emit('getImgUrl', this.imgUrl)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../style/rotate';
</style>
