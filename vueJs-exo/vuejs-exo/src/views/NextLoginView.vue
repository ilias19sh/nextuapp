<script>
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
export default defineComponent({
  name: 'NextLoginView',
  data()  {
    return {
        user:{login : 'username@gmail.com',
        pwd : 'motdepasse'},
        router : useRouter()
        


    }
  },
  methods: {
    authenticate(){
        console.log(this.user)
        localStorage.setItem('isAuthenticated', true)
        this.router.push({
            path : '/dashboard/home'
        })
    }
  }
})
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h1>Bienvenue</h1>
        <p>Connectez-vous à votre compte</p>
      </div>

      <form @submit.prevent = "authenticate()">
        <div class="form-group">
          <label for="email">Email</label>
          <input v-model = "user.login" type="email" id="email" required />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input v-model = "user.pwd" type="password" id="password" required />
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" />
            <span>Se souvenir de moi</span>
          </label>
          <a href="#" class="forgot-password">Mot de passe oublié ?</a>
        </div>

        <button type="submit" class="login-button">Se connecter</button>
      </form>

      <div class="login-footer">
        <p>Pas encore de compte ? <a href="#">S'inscrire</a></p>
      </div>
    </div>
  </div>
</template>
<style>
:root {
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --text-color: #1f2937;
  --text-light: #6b7280;
  --bg-color: #f3f4f6;
  --white: #ffffff;
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #f3f4f6 0%, #dfe3e8 100%);
  color: var(--text-color);
  line-height: 1.5;
  min-height: 100vh;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.login-box {
  background: var(--white);
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: var(--text-light);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-group input:focus {
  border-color: var(--primary-color);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.forgot-password {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.875rem;
}

.forgot-password:hover {
  text-decoration: underline;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color);
  color: var(--white);
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-button:hover {
  background-color: var(--primary-hover);
}

.login-footer {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--text-light);
}

.login-footer a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.login-footer a:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .login-box {
    padding: 1.5rem;
  }

  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
