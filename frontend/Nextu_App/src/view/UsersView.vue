<script>
import { defineComponent } from "vue";
import { getUsers, deleteUser, getUserById } from "@/api/NextuApi";

export default defineComponent({
  name: "Users",
  data() {
    return {
      users: [],
      admin: false,
      directeur: false,
      userId: null,
      type: [],
    };
  },
  async mounted() {
    this.users = await getUsers();
    this.userId = parseInt(localStorage.getItem("userId")) || 0;
    this.type = await getUserById(this.userId);

    if (this.type[0].type === "admin" ) {
      this.admin = true;
    }
    if (this.type[0].type === "directeur" ) {
      this.directeur = true;
    }
    console.log(this.users);
  },
  methods: {
    navigateToUser(userId) {
      this.$router.push(`/dashboard/user/${userId}`);
    },
    async deleteuser(id) {
      try {
        await deleteUser(id);
        console.log(`le user ${id} a bien été supprimée`);
        window.location.replace("http://localhost:5173/dashboard/Users");
      } catch (error) {
        console.error(error);
      }
    },
  },
});
</script>

<template>
  <div class="users-container">
    <div v-if="directeur">
    <button class="create-admin" @click="$router.push('/dashboard/create-admin')" style="padding: 10px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; display: flex; align-items: center;">
      <i class="fas fa-user-plus" style="margin-right: 5px;"></i>
      <span>Créer Administrateur</span>
    </button>
    </div>
    <br/>
    <div
      class="user-profile-card"
      v-for="user in users"
      :key="user.id"
      @click="navigateToUser(user.id)"
    >
      <div class="profile-content">
        <div class="post-header">
          <div
            class="profile-pic"
            :class="{ 'gradient-blue': !user.pdpurl }"
            :style="user.pdpurl ? `background-image: url(${user.pdpurl})` : ''"
          ></div>
          <div class="profile-info">
            <h2 class="profile-name">{{ user.firstname }} {{ user.lastname }}</h2>
            <div class="profile-details">
              <p class="profile-type">
                <strong
                  >{{ user.Student ? "Étudiant" : user.Admin ? user.Admin.job : "Non défini" }} à
                  {{
                    user.Student ? user.Student.school : user.Admin ? "Next-U" : "Non défini"
                  }}</strong
                >
              </p>

              <div v-if="admin || directeur" >
                <button class="delete-user" @click="deleteuser(user.id)">
                  <i class="fas fa-trash"></i>
                  <span>Supprimer</span>
                </button>
              </div>
              <div class="profile-year" v-if="user.Student">
                <span>N{{ user.Student.year }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
