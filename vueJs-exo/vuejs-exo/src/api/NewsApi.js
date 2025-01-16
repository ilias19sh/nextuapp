import axios from "axios";
export const getNews = async () => {
    const response = await axios.get('https://newsapi.org/v2/top-headlines?country=us&category=business&apiKey=7b2a9ac64df54043b31dc4126b061795');
    return response.data.articles;
}

export const getPost = async() => {
    const response = await axios.get('http://localhost:3000/api/v1/nextu/posts');
    return response.data
}