// pocketbase/config.js

const POCKETBASE_PORT = "8090";
const POCKETBASE_URL = `http://${window.location.hostname}:${POCKETBASE_PORT}`;

const pb = new PocketBase(POCKETBASE_URL);

