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
