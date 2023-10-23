isHome();

$(document).ready(() => {
    const table = new DataTable('#accountTable', {
        ajax: {
            url: '/api/v1/account',
            method: 'GET',
            beforeSend: (xhr) => {
                xhr.setRequestHeader('Authorization', `Bearer ${onGetSession().token}`);
            },
            error: (error) => {
                if (error.responseJSON.value.isAuth === false) {
                    logout();
                } else {
                    Swal.fire({
                        title: 'Account List Failed!',
                        icon: 'error',
                        text: error.responseJSON.message,
                        showConfirmButton: false,
                    });
                }
            }
        },
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'url' },
            {
                data: 'datetime_create',
                visible: false,
                render: (data, type, full, meta) => {
                    return new Date(data).toLocaleString().replace(',', '');
                }
            },
            {
                data: 'datetime_update',
                render: (data, type, full, meta) => {
                    return new Date(data).toLocaleString().replace(',', '');
                }
            },
            {
                data: null,
                orderable: false,
                defaultContent: `<button type='button' class='btn btn-secondary-custom edit' data-bs-toggle="modal" data-bs-target="#formEditModal">
                                    <i class="bi bi-pen-fill"></i>
                                </button>
                                <button type='button' class='btn btn-close-modal delete'>
                                    <i class="bi bi-trash-fill"></i>
                                </button>`
            }
        ],
        processing: true,
        serverSide: true,
        responsive: true,
        select: false
    });

    $("#formAddModal").on("hidden.bs.modal", () => {
        document.getElementById('formAdd').reset();
    });

    const formsAdds = document.querySelectorAll('#formAdd');

    Array.prototype.slice.call(formsAdds).forEach((form) => {
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (form.checkValidity()) {
                onAdd();
            }

            form.classList.add('was-validated');
        }, false)
    });

    table.on('click', 'button.edit', (e) => {
        const formsEdits = document.querySelectorAll('#formEdit');

        Array.prototype.slice.call(formsEdits).forEach((form) => {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                event.stopPropagation();
    
                if (form.checkValidity()) {
                    onEdit(data.id);
                }
    
                form.classList.add('was-validated');
            }, false)
        });

        const data = table.row(e.target.closest('tr')).data();
        document.getElementById('nameEdit').value = data.name;
        document.getElementById('urlEdit').value = data.url;
    });

    table.on('click', 'button.delete', (e) => {
        const data = table.row(e.target.closest('tr')).data();
        Swal.fire({
            title: 'Are you sure ?',
            text: `You won't be able to revert this!`,
            icon: 'warning',
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#EF8249',
            cancelButtonText: 'No, cancel!',
            cancelButtonColor: '#C4677B',
            showCancelButton: true,
            reverseButtons: true,
        }).then((result) => {
            if (result.value) {
                onDelete(data.id);
            }
        });
    });

    function onAdd() {
        onLoading(true);
    
        const name = document.getElementById('name').value;
        const url = document.getElementById('url').value;
    
        $.ajax({
            url: '/api/v1/account',
            type: 'POST',
            data: JSON.stringify({ name, url }),
            contentType: 'application/json; charset=utf-8',
            beforeSend: (xhr) => {
                xhr.setRequestHeader('Authorization', `Bearer ${onGetSession().token}`);
            },
            traditional: true
        }).done((response) => {
            onLoading(false);
            bootstrap.Modal.getInstance(document.getElementById('formAddModal')).hide();
            Swal.fire({
                title: 'Successfully!',
                text: response.message,
                icon: 'success',
                showConfirmButton: false,
                // didClose: () => { }
            });
            table.ajax.reload();
        }).fail((error, textStatus) => {
            onLoading(false);
            Swal.fire({
                title: 'Register Account Failed!',
                icon: 'error',
                text: error.responseJSON.message,
                showConfirmButton: false,
            });
        }).always(() => {
    
        });
    }
    
    function onEdit(id) {
        onLoading(true);
    
        const name = document.getElementById('nameEdit').value;
        const url = document.getElementById('urlEdit').value;
    
        $.ajax({
            url: `/api/v1/account/${id}`,
            type: 'PUT',
            data: JSON.stringify({ name, url }),
            contentType: 'application/json; charset=utf-8',
            beforeSend: (xhr) => {
                xhr.setRequestHeader('Authorization', `Bearer ${onGetSession().token}`);
            },
            traditional: true
        }).done((response) => {
            onLoading(false);
            document.getElementById('formEdit').reset();
            bootstrap.Modal.getInstance(document.getElementById('formEditModal')).hide();
            Swal.fire({
                title: 'Successfully!',
                text: response.message,
                icon: 'success',
                showConfirmButton: false,
                // didClose: () => { }
            });
            table.ajax.reload();
        }).fail((error, textStatus) => {
            onLoading(false);
            Swal.fire({
                title: 'Update Account Failed!',
                icon: 'error',
                text: error.responseJSON.message,
                showConfirmButton: false,
            });
        }).always(() => {
    
        });
    }
    
    function onDelete(id) {
        onLoading(true);
    
        $.ajax({
            url: `/api/v1/account/${id}`,
            type: 'DELETE',
            beforeSend: (xhr) => {
                xhr.setRequestHeader('Authorization', `Bearer ${onGetSession().token}`);
            },
            traditional: true
        }).done((response) => {
            onLoading(false);
            Swal.fire({
                title: 'Successfully!',
                text: response.message,
                icon: 'success',
                showConfirmButton: false,
                // didClose: () => { }
            });
            table.ajax.reload();
        }).fail((error, textStatus) => {
            onLoading(false);
            Swal.fire({
                title: 'Delete Account Failed!',
                icon: 'error',
                text: error.responseJSON.message,
                showConfirmButton: false,
            });
        }).always(() => {
    
        });
    }
});
