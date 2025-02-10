<script>
import { PostUser, getUsers } from '@/api/NextuApi';
import { defineComponent } from 'vue';


export default defineComponent({
  name: 'SignInView',
  data() {
    return {
      firstname: '',
      lastname: '',
      get email() {
        return this.firstname.toLowerCase() + '.' + this.lastname.toLowerCase() + '@next-u.fr';
      },
      birthday: '',
      entrance_date: '',
      password: '',
      type: 'admin',
      registration_number: '',
      job: '',
      year: '',
    }
  },
  methods: {
    async submit() {
      const existingUsers = await getUsers();
      const userExists = existingUsers.some(user => user.email.toLowerCase() === this.email.toLowerCase());
      if (userExists) {
        alert("Un utilisateur avec cet email existe déjà.");
        return;
      }
      try {
        const userData = {
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          birthday: this.birthday,
          entrance_date: this.entrance_date +'-09-01',
          password: this.password,
          type: this.type,
          year: this.year,
          registration_number: this.registration_number,
          job: this.job,
        };
        
        const response = await PostUser(userData);
        console.log('Utilisateur créé avec succès:', response);
        this.$router.push('/dashboard/users');
        
      } catch (error) {
        console.error('Erreur lors de la création de l’utilisateur:', error);
      }
    }
  }
})
</script>
<template>
  <div class="login-container">
    <h2 class="form-title">Créer un compte administrateur</h2>
    <form @submit.prevent="submit">
      <div class="form-group">
        <label class="form-label" for="firstname">Prénom</label>
        <input class="form-input" type="text" id="firstname" v-model="firstname" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="lastname">Nom</label>
        <input class="form-input" type="text" id="lastname" v-model="lastname" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="entrance_date">Date d'entrée</label>
        <select class="form-input" id="entrance_date" v-model="entrance_date" required>
          <option disabled value="">Sélectionnez une année</option>
          <option v-for="year in Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label" for="job">Poste</label>
        <input class="form-input" type="text" id="job" v-model="job" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="registration_number">NNuméro d'enregistrement</label>
        <input class="form-input" type="text" id="registration_number" v-model="registration_number" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="birthday">Date de naissance</label>
        <input class="form-input" type="date" id="birthday" v-model="birthday" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="email">Email</label>
        <input class="form-input" type="email" id="email" v-model="email" required>
      </div>
      <div class="form-group">
        <label class="form-label" for="password">Mot de passe</label>
        <input class="form-input" type="password" id="password" v-model="password" required>
      </div>
      <button class="login-button" type="submit">Créer un admin</button>
    </form>
  </div>

</template>


<style scoped>
.login-container {
  max-width: 450px;
  margin: 120px auto;
  padding: 40px;
  background: var(--light);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(24, 119, 242, 0.15);
  animation: fadeIn 0.6s ease-out;
}

.form-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--primary-blue);
  text-align: center;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #65676b;
  font-weight: 600;
  font-size: 0.95rem;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid rgba(24, 119, 242, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--gray);
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: 0 0 0 4px rgba(24, 119, 242, 0.1);
  background: var(--light);
}

.login-button {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: var(--gradient-blue);
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(24, 119, 242, 0.2);
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24, 119, 242, 0.3);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>