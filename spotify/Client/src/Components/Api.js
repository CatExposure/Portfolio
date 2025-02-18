const apiUrl = process.env.NODE_ENV === 'production' ? "api/" : "http://localhost:5000/";
const redirectUri = process.env.NODE_ENV === 'production' ? "https://spotify.protosite.online/" : "http://localhost:3000/";

export {
    apiUrl,
    redirectUri
}