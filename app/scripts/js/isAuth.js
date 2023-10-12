if (isAuthenticated()) {
    location.href = '/home';
} else {
    location.href = '/login';
}