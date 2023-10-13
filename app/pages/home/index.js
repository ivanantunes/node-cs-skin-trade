if (!isAuthenticated()) {
    location.href = '/login';
}

$(document).ready(() => {
    const loading = document.getElementById('loading');
    const session = onGetSession();

    changeScreen('/dashboard/');
    $('#profilePhoto').attr('src', `/web/assets/images/agents/${Math.floor(Math.random() * 5) + 1}.png`);
    $('#profileName').html(session.username);
    $('#profileEmail').html(session.email);

    $(".sidebar-dropdown > a").click(function () {
        $(".sidebar-submenu").slideUp(200);
        if (
            $(this)
            .parent()
            .hasClass("active")
        ) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .parent()
                .removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .next(".sidebar-submenu")
                .slideDown(200);
            $(this)
                .parent()
                .addClass("active");
        }
    });
    
    $("#close-sidebar").click(function () {
        $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function () {
        $(".page-wrapper").addClass("toggled");
    });
});

/**
 * Load New Screen
 * @param {String} url
 */
function changeScreen(url) {
    $('#screen').load(url, () => { });
}
