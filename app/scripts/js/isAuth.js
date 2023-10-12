const isSession = localStorage.getItem('session');

if (isSession) {
    location.href = '/home';
} else {
    location.href = '/login'
}
