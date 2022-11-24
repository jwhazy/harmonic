export default import.meta.env.PROD
  ? `http://${window.location.hostname}:${window.location.port}`
  : `http://${window.location.hostname}:${import.meta.env.VITE_BACKEND_PORT}`;
