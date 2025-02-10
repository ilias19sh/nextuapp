<script>
import { getUsers } from "@/api/NextuApi";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "LoginView",
  data() {
    return {
      user: { login: "username@gmail.com", pwd: "motdepasse" },
      router: useRouter(),
    };
  },
  async mounted() {
    this.users = await getUsers();
  },
  methods: {
    authenticate() {
      console.log(this.user);
      const userFound = this.users.find(
        (u) => u.email.toLowerCase() === this.user.login.toLowerCase(),
      );
      if (!userFound) {
        alert("Aucun utilisateur trouvé avec cet email");
        return;
      }
      if (userFound.password !== this.user.pwd) {
        alert("Mot de passe incorrect");
        return;
      }
      localStorage.setItem("userId", userFound.id);
      localStorage.setItem("isAuthenticated", true);
      this.router.push({ path: "/dashboard/home" });
    },
  },
});
</script>
<template>
  <div class="login-container">
    <form @submit.prevent="authenticate()">
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="user.login" type="email" id="email" required />
      </div>

      <div class="form-group">
        <label for="password">Mot de passe</label>
        <input v-model="user.pwd" type="password" id="password" required />
      </div>

      <div class="form-options">
        <label class="remember-me">
          <input type="checkbox" />
          <span>Se souvenir de moi</span>
        </label>
        <a
          href="mailto:pedagogie.lille@next-u.fr?subject=Récupération de mot de passe"
          class="forgot-password"
          >Mot de passe oublié ?</a
        >
      </div>

      <button type="submit" class="login-button">Se connecter</button>
      <br/><br/>
      <button type="button"  @click="$router.push('/signin')" class="login-button">Créer mon compte</button>
    </form>
  </div>
</template>
