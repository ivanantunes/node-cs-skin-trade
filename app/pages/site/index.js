$(document).ready(() => {
    const table = new DataTable('#siteTable', {
        ajax: {
            url: '/api/v1/site',
            method: 'GET',
            beforeSend: (xhr) => {
                xhr.setRequestHeader('Authorization', `Bearer ${onGetSession().token}`);
            },
            error: (error) => {
                if (error.responseJSON.value.isAuth === false) {
                    logout();
                } else {
                    Swal.fire({
                        title: 'Site List Failed!',
                        icon: 'error',
                        text: error.responseJSON.message,
                        showConfirmButton: false,
                    });
                }
            }
        },
        columns: [
            { data: 'id' },
            { data: 'title' },
            { data: 'url' },
            { data: 'sales_commission_percent', render: (data, type, full, meta) => `${Number(data).toFixed(2)} %` },
            { data: 'fee_withdraw_percent', render: (data, type, full, meta) => `${Number(data).toFixed(2)} %` },
            {
                data: 'opening_balance',
                render: (data, type, full, meta) => {
                    return Number(data).toLocaleString(navigator.language,{style: 'currency', currency: navigator.language === 'pt-BR' ? 'BRL' : 'USD'});
                }
            },
            {
                data: 'balance',
                render: (data, type, full, meta) => {
                    return Number(data).toLocaleString(navigator.language,{style: 'currency', currency: navigator.language === 'pt-BR' ? 'BRL' : 'USD'});
                }
            },
            {
                data: 'account',
                orderable: false,
                render: (data, type, full, meta) => {
                    return data.name;
                }
            },
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

    loadingAccountOption();

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
        document.getElementById('titleEdit').value = data.title;
        document.getElementById('urlEdit').value = data.url;
        document.getElementById('sales_commission_percentEdit').value = data.sales_commission_percent;
        document.getElementById('fee_withdraw_percentEdit').value = data.fee_withdraw_percent;
        document.getElementById('opening_balanceEdit').value = data.opening_balance;
        document.getElementById('balanceEdit').value = data.balance;
        document.getElementById('accountEdit').value = data.account.name;
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
    
        const title = document.getElementById('title').value;
        const url = document.getElementById('url').value;
        const sales_commission_percent = document.getElementById('sales_commission_percent').value;
        const fee_withdraw_percent = document.getElementById('fee_withdraw_percent').value;
        const opening_balance = document.getElementById('opening_balance').value;
        const balance = document.getElementById('balance').value;
        const account_id = document.querySelector("#datalistAccount option[value='"+document.getElementById('account').value+"']").dataset.value;
    
        $.ajax({
            url: '/api/v1/site',
            type: 'POST',
            data: JSON.stringify({ title, url, sales_commission_percent, fee_withdraw_percent, opening_balance, balance, account_id }),
            contentType: 'application/json; charset=utf-8',
            beforeSend: (xhr) => {
                xhr.setRequestHeader('Authorization', `Bearer ${onGetSession().token}`);
            },
            traditional: true
        }).done((response) => {
            onLoading(false);
            document.getElementById('formAdd').reset();
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
                title: 'Register Site Failed!',
                icon: 'error',
                text: error.responseJSON.message,
                showConfirmButton: false,
            });
        }).always(() => {
    
        });
    }

    function onEdit(id) {
        onLoading(true);
    
        const title = document.getElementById('titleEdit').value;
        const url = document.getElementById('urlEdit').value;
        const sales_commission_percent = document.getElementById('sales_commission_percentEdit').value;
        const fee_withdraw_percent = document.getElementById('fee_withdraw_percentEdit').value;
        const opening_balance = document.getElementById('opening_balanceEdit').value;
        const balance = document.getElementById('balanceEdit').value;
        const account_id = document.querySelector("#datalistAccount option[value='"+document.getElementById('accountEdit').value+"']").dataset.value;

        $.ajax({
            url: `/api/v1/site/${id}`,
            type: 'PUT',
            data: JSON.stringify({ title, url, sales_commission_percent, fee_withdraw_percent, opening_balance, balance, account_id }),
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
                title: 'Update Site Failed!',
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
            url: `/api/v1/site/${id}`,
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
                title: 'Delete Site Failed!',
                icon: 'error',
                text: error.responseJSON.message,
                showConfirmButton: false,
            });
        }).always(() => {
    
        });
    }
});

function changeHandlerPercent(val) {
    if (Number(val.value) > 100) {
        val.value = 100
    }

    if (Number(val.value) < 0) {
        val.value = 0;
    }
}

function changeHandlerMoney(val) {
    if (Number(val.value) < 0) {
        val.value = 0;
    }
}

function loadingAccountOption() {
    onLoading(true);
    $.ajax({
        url: '/api/v1/account/all',
        method: 'GET',
        beforeSend: (xhr) => {
            xhr.setRequestHeader('Authorization', `Bearer ${onGetSession().token}`);
        },
        success: (result) => {
            const dataList = document.getElementById('datalistAccount');

            result.forEach((row) => {
                const option = document.createElement('option');
                option.value = row.name;
                option.setAttribute('data-value', row.id);

                dataList.appendChild(option);
            });
            onLoading(false);
        },
        error: (error) => {
            onLoading(false);

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
    });
}