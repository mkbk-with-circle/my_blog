<template>
  <div class="features-carousel" v-if="items.length">
    <button class="fc-btn fc-prev" type="button" @click="prev" aria-label="上一张">‹</button>

    <div class="fc-track" ref="track">
      <a v-for="(it, i) in items" :key="i" class="fc-card" :href="it.link">
        <h2 class="fc-title">{{ it.title }}</h2>
        <p class="fc-desc">{{ it.details }}</p>
      </a>
    </div>

    <button class="fc-btn fc-next" type="button" @click="next" aria-label="下一张">›</button>
  </div>
</template>

<script>
export default {
  name: 'FeaturesCarousel',
  computed: {
    items() {
      return (this.$page?.frontmatter?.features) || []
    },
  },
  methods: {
    scrollByCard(dir) {
      const el = this.$refs.track
      if (!el) return
      const card = el.querySelector('.fc-card')
      const step = card ? card.getBoundingClientRect().width + 14 : el.clientWidth * 0.9
      el.scrollBy({ left: dir * step, behavior: 'smooth' })
    },
    prev() { this.scrollByCard(-1) },
    next() { this.scrollByCard(1) },
  },
}
</script>

<style scoped>
.features-carousel { position: relative; }

.fc-track{
  display:flex; flex-wrap:nowrap;
  overflow-x:auto; overflow-y:hidden;
  -webkit-overflow-scrolling:touch;
  scroll-snap-type:x mandatory;
  gap:14px;
  padding:0 44px;
  scrollbar-width:none;
}
.fc-track::-webkit-scrollbar{ display:none; }

.fc-card{
  scroll-snap-align:start;
  flex:0 0 86%;
  max-width:86%;
  display:block;
  text-decoration:none;
  padding:1.4rem;
  border-radius:12px;
  background:rgba(255,255,255,0.12);
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  border:1px solid rgba(255,255,255,0.2);
  box-shadow:0 4px 12px rgba(0,0,0,0.15);
}
.fc-title{ margin:0 0 .6rem 0; font-size:1.2rem; font-weight:600; color:#fff; }
.fc-desc{ margin:0; color:rgba(255,255,255,0.9); line-height:1.6; font-size:.95rem; }

.fc-btn{
  position:absolute; top:50%; transform:translateY(-50%);
  z-index:2;
  width:34px; height:34px; border-radius:999px;
  border:1px solid rgba(255,255,255,0.35);
  background:rgba(0,0,0,0.35);
  color:#fff;
  font-size:22px; line-height:32px;
  padding:0;
}
.fc-prev{ left:10px; }
.fc-next{ right:10px; }
</style>
