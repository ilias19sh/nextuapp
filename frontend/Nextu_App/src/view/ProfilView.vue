<script>
import { defineComponent } from "vue";
import { getUserById, getPublication, updatePublication, deletePublication, getImage } from "@/api/NextuApi";

export default defineComponent({
  name: "ProfilView",
  data() {
    return {
      user: "anonymous",
      userPosts: [],
      userId: null,
      profilId: 0,
      monProfil: false,
      type: [],
      userBadges: [],
      keyword: ["ambassador", "BDE", "admin", "special"],
      admin: false,
      userImages: [],
    };
  },
  async mounted() {
    const profilId = this.$route.params.id;
    this.user = await getUserById(profilId);
    const posts = await getPublication();
    this.userPosts = posts.filter((post) => post.user_id === parseInt(profilId));
    
    // Récupération des informations utilisateur pour vérifier les permissions
    this.userId = parseInt(localStorage.getItem("userId")) || 0;
    this.type = await getUserById(this.userId);
    
    // Détermination des badges et permissions de l'utilisateur connecté
    if (this.type && this.type[0]) {
      if (this.type[0].Student && Array.isArray(this.type[0].Student.badges)) {
        this.userBadges = this.type[0].Student.badges;
      } else if (this.type[0].type === "admin") {
        this.userBadges = [this.type[0].type];
        this.admin = true;
      }
    }
    
    // Vérification si l'utilisateur consulte son propre profil
    this.monProfil = this.userId === parseInt(profilId);
    
    // Récupération des images via l'API dédiée
    const allImages = await getImage();
    if (allImages) {
      this.userImages = allImages;
      
      // Possibilité d'utiliser une image comme photo de profil si l'utilisateur n'en a pas
      if (this.user && this.user[0] && !this.user[0].pdpurl && this.userImages.length > 0) {
        console.log("Images disponibles pour l'utilisateur:", this.userImages);
      }
    }
  },
  methods: {
    getUser(post) {
      if (!this.users || this.users.length === 0) {
        console.error("Les utilisateurs ne sont pas encore chargés");
        return null;
      }
      return this.users.find((u) => u.id === post.user_id);
    },
    formattedDate(post) {
      return formatDistanceToNow(new Date(post.creation_date), { addSuffix: true });
    },

    async vote(post, reponse) {
      if (this.hasVoted(post)) {
        alert("Vous avez déjà voté !");
        return;
      }

      // Assure que users_id est un tableau valide
      if (!Array.isArray(reponse.users_id)) {
        reponse.users_id = []; // Initialise si nécessaire
      }

      if (localStorage.getItem("HasVoted") === reponse.id) {
        alert("Vous avez déjà voté pour cette réponse !");
        return;
      }

      if (reponse.users_id.includes(this.userId)) {
        alert("Vous avez déjà voté pour cette réponse !");
        return;
      }

      // Ajoute l'ID de l'utilisateur à la liste des votes
      reponse.users_id.push(this.userId);

      const postData = {
        reponse_id: reponse.id,
        user_id: this.userId,
        users_id: reponse.users_id, // Met à jour la liste des users_id
      };

      try {
        await updatePublication(post.id, postData);
        alert("Vote enregistré !");
        localStorage.setItem("HasVoted", reponse.id); // Marque le vote dans le localStorage
      } catch (error) {
        console.error("Erreur lors du vote :", error);
      }
    },
    getPercentage(reponse, reponses) {
      const total = reponses.reduce(
        (sum, rep) => sum + (Array.isArray(rep.users_id) ? rep.users_id.length : 0),
        0,
      );
      if (total === 0) return 0;
      return ((reponse.users_id.length / total) * 100).toFixed(2);
    },
    async like(post) {
      const index = post.like.indexOf(this.userId);
      if (index !== -1) {
        post.like.splice(index, 1);
      } else {
        post.like.push(this.userId);
      }
      const postData = {
        like: post.like,
      };

      try {
        await updatePublication(post.id, postData);
        console.log("likes :", post.like);
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du like :", error);
      }
    },
    async deletePost(postid) {
      try {
        await deletePublication(postid);
        console.log(`la publication ${postid} a bien été supprimée`);
        window.location.reload();
      } catch (error) {
        console.error(error);
      }
    },
    displayUserImages() {
      if (!this.userImages || this.userImages.length === 0) {
        return "Aucune image disponible";
      }
      
      // Extraction des URLs d'images pour affichage
      return this.userImages.map(img => img.url || img.path).join(", ");
    },
  },
  computed: {
    hasVoted() {
      return (post) => {
        if (!post?.Sondages?.length || !Array.isArray(post.Sondages[0]?.Reponses)) {
          return false; // Retourne false si aucune réponse n'est trouvée
        }

        // Vérifie si l'utilisateur a voté pour une réponse
        return post.Sondages[0].Reponses.some(
          (reponse) => Array.isArray(reponse.users_id) && reponse.users_id.includes(this.userId),
        );
      };
    },
  },
});
</script>

<template>
  <div class="user-detail-container">
    <div v-if="user" class="user-detail-card">
      <div class="user-detail-header">
        <div
          class="profile-pic large"
          :class="{ 'gradient-blue': !user[0].pdpurl }"
          :style="user[0].pdpurl ? `background-image: url(${user[0].pdpurl})` : ''"
        ></div>
        <div class="user[0]-detail-info">
          <h1>{{ user[0].firstname }} {{ user[0].lastname }}</h1>
          <p class="profile-type">
            <strong>
              {{ user[0].Student ? "Étudiant" : user[0].Admin ? "Administrateur" : "Non défini" }}
              à
              {{
                user[0].Student
                  ? user[0].Student.school
                  : user[0].Admin
                    ? user[0].Admin.job
                    : "Non défini"
              }}
            </strong>
          </p>
        </div>
        <span v-if="user[0].Student" class="profile-year">N{{ user[0].Student.year }}</span>
      </div>

      <div class="user-detail-content">
        <div class="detail-section">
          <p>
            À rejoint Next-U depuis le {{ new Date(user[0].entrance_date).toLocaleDateString() }}
          </p>
        </div>

        <div v-if="user[0].Student" class="detail-section">
          <div
            v-if="user[0].Student.badges && user[0].Student.badges.length"
            class="badges-section"
          >
            <h3>Badges</h3>
            <div class="badges-container">
              <span class="profile-badge" v-for="badge in user[0].Student.badges" :key="badge">
                {{ badge }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="user[0].Admin" class="detail-section">
          <h2>Informations administrateur</h2>
          <p><strong>Poste:</strong> {{ user[0].Admin.job }}</p>
        </div>
      </div>
    </div>
    <div class="container" v-if="userPosts.length">
      <div class="post" v-for="post in userPosts" :key="post.id">
        <div class="post-header">
          <div
            class="profile-pic"
            :class="{ 'gradient-blue': !user[0].photo }"
            :style="user[0].photo ? `background-image: url(${user[0].photo})` : ''"
          ></div>
          <div class="post-info">
            <h3>{{ user[0].firstname }} {{ user[0].lastname }}</h3>
            <span class="post-date">{{ new Date(post.creation_date).toLocaleDateString() }}</span>
          </div>
          <div v-if="monProfil || admin">
            <button class="delete-button" @click="deletePost(post.id)">
              <i class="fas fa-trash"></i>
              <span>Supprimer</span>
            </button>
          </div>
        </div>
        <div class="post-content" v-if="post.Media.length > 0">
          <p>{{ post.description }}</p>
          <img :src="post.Media[0].url_media" alt="Post image" class="post-image" />
        </div>
        <div v-if="post.Sondages.length > 0">
          <h4>{{ post.Sondages[0].title }}</h4>
          <br />
          <div v-if="hasVoted(post)">
            <div v-for="(reponse, i) in post.Sondages[0].Reponses" :key="i">
              <div class="sondage-button">
                <div
                  class="sondage-progress"
                  :style="{ width: getPercentage(reponse, post.Sondages[0].Reponses) + '%' }"
                ></div>
                <span class="sondage-text">
                  {{ reponse.text }} - {{ getPercentage(reponse, post.Sondages[0].Reponses) }}%
                </span>
              </div>
            </div>
          </div>
          <div v-else>
            <div v-for="(reponse, i) in post.Sondages[0].Reponses" :key="i">
              <div class="sondage-button">
                <button @click="vote(post, reponse)">
                  {{ reponse.text }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="post-actions">
          <button class="action-button" @click="like(post)">
            <i class="fas fa-heart" :class="{ liked: post.like.includes(userId) }"></i>
            <span class="like-count">{{ post.like.length }}</span>
          </button>

          <button class="action-button">
            <i class="fas fa-share"></i>
            <span>Partager</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
