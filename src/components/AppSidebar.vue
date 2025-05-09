<template>
  <aside :class="['sidebar', { 'open': isOpen }]">
    <nav>
      <ul>
        <li v-for="item in menuItems" :key="item.path">
          <router-link 
            :to="item.path" 
            class="nav-link"
            @click="$emit('close')"
          >
            <span class="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path :d="item.icon"></path>
              </svg>
            </span>
            <span class="text">{{ item.title }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
defineProps({
  isOpen: Boolean
})

defineEmits(['close'])

const menuItems = [
  { 
    path: '/notes', 
    title: 'Todas las notas', 
    icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2 14 8 20 8 M16 13H8 M16 17H8 M10 9H9H8'
  },
  { 
    path: '/favorites', 
    title: 'Favoritas', 
    icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'
  }
]
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 250px;
  background: white;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 100;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar.open {
  transform: translateX(0);
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 1rem;
  text-decoration: none;
  color: #333;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #f0f0f0;
}

.nav-link.router-link-active {
  background-color: #e6e0ff;
  color: #6e45e2;
}

.icon {
  margin-right: 1rem;
  display: flex;
  align-items: center;
}

.text {
  font-size: 0.9rem;
}

@media (min-width: 768px) {
  .sidebar {
    transform: translateX(0);
    position: sticky;
    top: 0;
  }
}
</style>