$(document).ready(() => {

    if (isAuthenticated()) {
        location.href = '/home';
        return;
    }

    const loading = document.getElementById('loading');

    $('#userImage').attr('src', `/web/assets/images/agents/${Math.floor(Math.random() * 5) + 1}.png`);

    const forms = document.querySelectorAll('.needs-validation');

    Array.prototype.slice.call(forms).forEach((form) => {
        form.addEventListener('submit', (event) => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                event.preventDefault();
                event.stopPropagation();
                onSubmit();
            }
            form.classList.add('was-validated');
        }, false)
    });

    function onSubmit() {
        loading.style.display = 'flex';
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        $.ajax({
            url: '/api/v1/authentication/login',
            type: 'POST',
            data: JSON.stringify({ email, password }),
            contentType: 'application/json; charset=utf-8',
            traditional: true
        }).done((response) => {
            onStartSession(response.value);
            location.href = '/home';
        }).fail((error, textStatus) => {
            loading.style.display = 'none';

            Swal.fire({
                title: 'Sing In Failed!',
                icon: 'error',
                text: error.responseJSON.message,
                showConfirmButton: false,
            });
        }).always(() => {

        });
    }
});
