if (!isAuthenticated()) {
    location.href = '/login';
}

$(document).ready(() => {
    const session = onGetSession();

    changeScreen('/purchases_and_sales/');
    $('#profilePhoto').attr('src', `/web/assets/images/agents/${Math.floor(Math.random() * 5) + 1}.png`);
    $('#profileName').html(session.username);
    $('#profileEmail').html(session.email);

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    $('.sidebar-dropdown > a').click(() => {
        $('.sidebar-submenu').slideUp(200);
        if (
            $(this)
            .parent()
            .hasClass('active')
        ) {
            $('.sidebar-dropdown').removeClass('active');
            $(this)
                .parent()
                .removeClass('active');
        } else {
            $('.sidebar-dropdown').removeClass('active');
            $(this)
                .next('.sidebar-submenu')
                .slideDown(200);
            $(this)
                .parent()
                .addClass('active');
        }
    });
    
    $('#close-sidebar').click(function () {
        $('.page-wrapper').removeClass('toggled');
    });
    $('#show-sidebar').click(function () {
        $('.page-wrapper').addClass('toggled');
    });
});

/**
 * Load New Screen
 * @param {String} url
 */
function changeScreen(url) {
    $('#screen').load(url, () => { });
}

/**
 * Start or Stop Loading
 * @param {boolean} status 
 */
function onLoading(status) {
    const loading = document.getElementById('loading');

    if (status) {
        loading.style.display = 'flex';
    } else {
        loading.style.display = 'none';
    }
}