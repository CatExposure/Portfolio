const apiUrl = process.env.NODE_ENV === 'production' ? "api/v1/" : "http://localhost:5000/";
const redirectUri = process.env.NODE_ENV === 'production' ? "https://protosite.online/" : "http://localhost:3000/";

export {
    apiUrl,
    redirectUri
}