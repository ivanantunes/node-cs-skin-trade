/**
 * Check is Exists Session
 * @returns {boolean}
 */
function isAuthenticated() {
    return localStorage.getItem('session') ? true : false
}

/**
 * Start a Session
 * @param {{ photo?: string, username: string, email: string, token: string }} session 
 */
function onStartSession(session) {
    localStorage.setItem('session', JSON.stringify(session));
}

/**
 * End a Session
 */
function onEndSession() {
    localStorage.removeItem('session');
}