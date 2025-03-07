<script>
import { defineComponent } from "vue";
import {
  getUsers,
  getPublication,
  updatePublication,
  PostPublication,
  getUserById,
  deletePublication,
  getImage,
  postImage
} from "@/api/NextuApi";
import { formatDistanceToNow } from "date-fns";
export default defineComponent({
  name: "publications",
  data() {
    return {
      posts: [],
      users: [],
      userId: null,
      type: [],
      userBadges: [],
      keyword: ["ambassador", "BDE", "admin", "special", "directeur"],
      admin: false,
      description: "",
      imageUrl: null,
      poll: [],
      pollOption: "",
      showImageInput: false,
      showPollInput: false,
      imageFile: null,
      images: [],
    };
  },
  async mounted() {
    this.posts = await getPublication();
    this.users = await getUsers();
    this.userId = parseInt(localStorage.getItem("userId")) || 0;
    this.type = await getUserById(this.userId);
    if (this.type && this.type[0]) {
      if (this.type[0].Student && Array.isArray(this.type[0].Student.badges)) {
        this.userBadges = this.type[0].Student.badges;
      } else if (this.type[0].type === "admin" || this.type[0].type === "directeur") {
        this.userBadges = [this.type[0].type];
        this.admin = true;
        console.log("badges : ", this.type[0].type);
      }
    }
    console.log("posts : ", this.posts);
    console.log("users :", this.users);
    this.images = await getImage();
    console.log("images récupérées:", this.images);
  },
  methods: {
    toggleImageInput() {
      this.showImageInput = !this.showImageInput;
      this.showPollInput = false;
      this.poll = [];
    },
    togglePollInput() {
      this.showPollInput = !this.showPollInput;
      this.showImageInput = false;
      this.imageUrl = null; // On enlève l'image si on choisit un sondage
    },
    handleFileUpload(event) {
      const file = event?.target?.files?.[0];
      if (!file) return;
      
      // Stocke le fichier pour l'envoi ultérieur via l'API
      this.imageFile = file;
      
      // Crée une prévisualisation de l'image avant envoi
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
        console.log("Image prête pour l'envoi");
      };
    },
    addPollOption() {
      if (this.pollOption && this.pollOption.trim() && this.poll.length < 4) {
        this.poll.push(this.pollOption.trim());
        console.log('reponse : ',this.poll)
        this.pollOption = ""; 
      }
    },
    removePollOption(index) {
      this.poll.splice(index, 1);
    },
    async submitPost() {
      try {
        let mediaUrl = null;
        
        // Si une image est sélectionnée, on l'envoie d'abord via l'API dédiée
        if (this.imageUrl && this.imageFile) {
          const imageData = {
            imageUrl: [this.imageFile],
            name: `post_${this.userId}_${Date.now()}`, // Nom unique basé sur l'ID utilisateur et timestamp
            age: "0" // Champ obligatoire pour l'API
          };
          
          const uploadResult = await postImage(imageData);
          if (uploadResult && uploadResult.newImage) {
            mediaUrl = uploadResult.newImage.url; // Récupère l'URL de l'image téléchargée
          }
        }
        
        // Construction de l'objet post avec les données appropriées
        const newPost = {
          "description": this.description,
          "user_id": this.userId,
          "type": this.showImageInput ? "image" : this.showPollInput ? "Sondage" : "text",
          "urlmedia": mediaUrl || this.imageUrl,
          "title": this.description,
          "reponse": this.poll || null // Inclut les options de sondage si présentes
        };
        
        console.log("Nouveau post:", newPost);
        await PostPublication(newPost);
        alert("Bien publié");
        
        // Réinitialisation des champs après publication réussie
        this.description = "";
        this.imageUrl = null;
        this.imageFile = null;
        this.poll = [];
        this.showImageInput = false;
        this.showPollInput = false;
        
        // Rafraîchir les publications pour afficher le nouveau post
        this.posts = await getPublication();
      } catch (error) {
        console.error("Erreur lors de la publication :", error);
      }
    },
    getUser(post) {
      // Vérifier si 'this.users' est défini et contient des éléments avant de chercher l'utilisateur
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

      
      if (!Array.isArray(reponse.users_id)) {
        reponse.users_id = []; 
      }

      if (localStorage.getItem("HasVoted") === reponse.id) {
        alert("Vous avez déjà voté pour cette réponse !");
        return;
      }

      if (reponse.users_id.includes(this.userId)) {
        alert("Vous avez déjà voté pour cette réponse !");
        return;
      }

      
      reponse.users_id.push(this.userId);

      const postData = {
        reponse_id: reponse.id,
        user_id: this.userId,
        users_id: reponse.users_id,
      };

      try {
        await updatePublication(post.id, postData);
        alert("Vote enregistré !");
        localStorage.setItem("HasVoted", reponse.id); 
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
  },
  computed: {
    hasVoted() {
      return (post) => {
        if (!post?.Sondages?.length || !Array.isArray(post.Sondages[0]?.Reponses)) {
          return false;
        }

        return post.Sondages[0].Reponses.some(
          (reponse) => Array.isArray(reponse.users_id) && reponse.users_id.includes(this.userId),
        );
      };
    },
  },
});
</script>
<template>
  <br /><br /><br /><br />
  <div class="create-post" v-if="userBadges.some((badge) => keyword.includes(badge))">
    <textarea v-model="description" placeholder="Exprimez-vous..." class="Newpost-text"></textarea>

    <div class="options">
      <button @click="toggleImageInput" :disabled="poll.length > 0">
        <i class="fas fa-image"></i>
        
      </button>
      <button @click="togglePollInput" :disabled="imageUrl">
        <i class="fas fa-poll"></i>
        
      </button>
    </div>

    <div v-if="showImageInput" class="image-upload-container">
      <input type="file" @change="handleFileUpload" class="file-input" />
      <img v-if="imageUrl" :src="imageUrl" alt="Image sélectionnée" class="preview-image" />
    </div>

    <div v-if="showPollInput" class="poll-input-container">
      <input
        v-model="pollOption"
        placeholder="Ajouter une option"
        @keyup.enter="addPollOption"
        class="poll-input"
      />
      <ul class="poll-options-list">
        <li v-for="(option, index) in poll" :key="index" class="poll-option">
          {{ option }}
          <button @click="removePollOption(index)" class="remove-poll-option">❌</button>
        </li>
      </ul>
    </div>

    <div class="options">
      <button @click="submitPost">Publier</button>
    </div>
  </div>
  <div class="container" v-for="(post, i) in this.posts">
    <div v-if="post.status" class="post">
      <div class="post-header">
        <div class="profile-pic gradient-blue"></div>
        <div class="post-info">
          <h3>{{ getUser(post).firstname }}</h3>
          <h3>{{ getUser(post).lastname }}</h3>
          <span>{{ formattedDate(post) }}</span>
        </div>
        <div v-if="admin || getUser(post).id === userId">
          <button class="delete-button" @click="deletePost(post.id)">
            <i class="fas fa-trash"></i>
            <span>Supprimer</span>
          </button>
        </div>
      </div>
      <h5>{{ post.description }}</h5>
      <br/>
      <img
        v-if="post.Media.length > 0"
        :src="post.Media[0].url_media"
        alt="Image de publication"
        class="post-image"
      />
      <div v-if="post.Sondages.length > 0">
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
            <div class="sondage-button"  @click="vote(post, reponse)">
                {{ reponse.text }}

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
</template>
