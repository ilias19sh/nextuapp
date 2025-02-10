<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "Header",
  methods: {
    logout() {
      localStorage.clear();
      window.location.reload();
    },
  },
});
</script>

<template>
  <header>
    <h1>Next-U App</h1>
    <nav>
      <ul>
        <li>
          <RouterLink to="/dashboard/home">
            <i class="fas fa-home"></i>
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/dashboard/Users">
            <i class="fas fa-users"></i>
          </RouterLink>
        </li>
      </ul>
    </nav>
    <div class="header-container">
      <button class="logout-button" @click="logout()">
        <i class="fas fa-sign-out-alt"></i> Déconnexion
      </button>
    </div>
  </header>
</template>
