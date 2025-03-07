import axios from "axios";

//Méthodes pour Users
export const getUsers = async () => {
  const response = await axios.get("http://localhost:3000/api/v1/nextu/users");
  return response.data;
};
export const getUserById = async (id) => {
  const response = await axios.get(`http://localhost:3000/api/v1/nextu/users/${id}`);
  return response.data;
};
export const PostUser = async (userData) => {
  const response = await axios.post("http://localhost:3000/api/v1/nextu/users", userData);
  return response.data;
};
export const updateUser = async (id, userData) => {
  const response = await axios.put(`http://localhost:3000/api/v1/nextu/users/${id}`, userData);
  return response.data;
};
export const deleteUser = async (id) => {
  const response = await axios.delete(`http://localhost:3000/api/v1/nextu/users/${id}`);
  return response.data;
};

//Méthodes pour publications

export const getPublication = async () => {
  const response = await axios.get("http://localhost:3000/api/v1/nextu/posts");
  return response.data;
};
export const getPublicationById = async (id) => {
  const response = await axios.get(`http://localhost:3000/api/v1/nextu/posts/${id}`);
  return response.data;
};
export const PostPublication = async (postData) => {
  const response = await axios.post("http://localhost:3000/api/v1/nextu/posts", postData);
  return response.data;
};
export const updatePublication = async (id, postData) => {
  const response = await axios.put(`http://localhost:3000/api/v1/nextu/posts/${id}`, postData);
  return response.data;
};
export const deletePublication = async (id) => {
  const response = await axios.delete(`http://localhost:3000/api/v1/nextu/posts/${id}`);
  return response.data;
};

// Fonction pour récupérer les images depuis le serveur multer
export const getImage = async () => {
    try {
        const response = await axios.get("http://localhost:3001/multer/images");
        return response.data
    } catch (error) {
        console.error("Erreur lors de la récupération des images :", error);
    }
};

// Fonction pour envoyer une image au serveur multer
export const postImage = async (data) => {
    // Création d'un FormData pour l'envoi de fichiers
    const formData = new FormData();
    formData.append("avatar", data.imageUrl[0]); // Le fichier image
    formData.append("name", data.name);          // Nom de l'image
    formData.append("age", data.age);            // Métadonnée requise par l'API

    try {
        // Envoi avec le header multipart/form-data nécessaire pour les fichiers
        const response = await axios.post("http://localhost:3001/multer/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'upload :", error);
        throw error; // Propager l'erreur pour la gérer dans le composant appelant
    }
};





