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

/**
 * Get a Session
 * @returns {{ photo?: string, username: string, email: string, token: string } | null} 
 */
function onGetSession() {
    let session = localStorage.getItem('session');

    if (session) {
        session = JSON.parse(session);
    }

    return session;
}

/**
 * Logout of System
 */
function logout() {
    onEndSession();
    location.href = '/login';
}

/**
 * Check Pathname is Different to Home
 */
function isHome() {
    if (location.pathname !== '/home/') {
        location.href = '/home/';
    }
}