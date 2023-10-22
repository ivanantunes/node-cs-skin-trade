function formatDataTable(data) {
    return (
        '<dl>' +
            '<dt>Full name:</dt>' +
            '<dd>' + data.item_exterior + '</dd>' +
            '<dt>Extension number:</dt>' +
            '<dd>' + data.item_rarity + '</dd>' +
        '</dl>'
    );
}

function loadingSiteOption() {
    onLoading(true);
    $.ajax({
        url: '/api/v1/site/all',
        method: 'GET',
        beforeSend: (xhr) => {
            xhr.setRequestHeader('Authorization', `Bearer ${onGetSession().token}`);
        },
        success: (result) => {
            const dataList = document.getElementById('datalistSite');

            result.forEach((row) => {
                const option = document.createElement('option');
                option.value = row.title;
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
                    title: 'Site List Failed!',
                    icon: 'error',
                    text: error.responseJSON.message,
                    showConfirmButton: false,
                });
            }
        }
    });
}

$(document).ready(() => {
    const table = new DataTable('#tableCrud', {
        ajax: {
            url: '/api/v1/purchase-and-sales',
            method: 'GET',
            beforeSend: (xhr) => {
                xhr.setRequestHeader('Authorization', `Bearer ${onGetSession().token}`);
            },
            error: (error) => {
                if (error.responseJSON.value.isAuth === false) {
                    logout();
                } else {
                    Swal.fire({
                        title: 'Item List Failed!',
                        icon: 'error',
                        text: error.responseJSON.message,
                        showConfirmButton: false,
                    });
                }
            }
        },
        columns: [
            {
                data: null,
                className: 'dt-control',
                orderable: false,
                defaultContent: ''
            },
            { data: 'id' },
            { data: 'item_name' },
            {
                data: 'item_price_on_steam',
                render: (data, type, full, meta) => {
                    return Number(data).toLocaleString(navigator.language,{style: 'currency', currency: navigator.language === 'pt-BR' ? 'BRL' : 'USD'});
                }
            },
            {
                data: 'purchase_price',
                render: (data, type, full, meta) => {
                    return Number(data).toLocaleString(navigator.language,{style: 'currency', currency: navigator.language === 'pt-BR' ? 'BRL' : 'USD'});
                }
            },
            { data: 'percent_discount_on_purchase', render: (data, type, full, meta) => `${Number(data).toFixed(2)} %` },
            {
                data: 'sale_value',
                render: (data, type, full, meta) => {
                    return Number(data).toLocaleString(navigator.language,{style: 'currency', currency: navigator.language === 'pt-BR' ? 'BRL' : 'USD'});
                }
            },
            { data: 'percent_discount_on_sale', render: (data, type, full, meta) => `${Number(data).toFixed(2)} %` },
            {
                data: 'balance_deducting_sales_commission',
                render: (data, type, full, meta) => {
                    return Number(data).toLocaleString(navigator.language,{style: 'currency', currency: navigator.language === 'pt-BR' ? 'BRL' : 'USD'});
                }
            },
            {
                data: 'final_balance',
                render: (data, type, full, meta) => {
                    return Number(data).toLocaleString(navigator.language,{style: 'currency', currency: navigator.language === 'pt-BR' ? 'BRL' : 'USD'});
                }
            },
            {
                data: 'profit',
                render: (data, type, full, meta) => {
                    return Number(data).toLocaleString(navigator.language,{style: 'currency', currency: navigator.language === 'pt-BR' ? 'BRL' : 'USD'});
                }
            },
            { data: 'status' },
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

    loadingSiteOption();

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

    table.on('click', 'td.dt-control', (e) => {
        let tr = e.target.closest('tr');
        let row = table.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
        } else {
            row.child(formatDataTable(row.data())).show();
        }
    });

    function onAdd() {
        onLoading(true);
    
        const item_name = document.getElementById('item_name').value;
        const item_weapon = document.getElementById('item_weapon').value;
        const item_exterior = document.getElementById('item_exterior').value || null;
        const item_rarity = document.getElementById('item_rarity').value || null;
        const item_type = document.getElementById('item_type').value || null;
        const item_float = document.getElementById('item_float').value || null;
        const item_is_stattrak = document.getElementById('item_is_stattrak').value === 'true';
        const item_has_sticker = document.getElementById('item_has_sticker').value === 'true';
        const item_is_souvenir = document.getElementById('item_is_souvenir').value === 'true';
        const item_price_on_steam = document.getElementById('item_price_on_steam').value;
        const purchase_price = document.getElementById('purchase_price').value;
        const percent_discount_on_purchase = document.getElementById('percent_discount_on_purchase').value;
        const sale_value = document.getElementById('sale_value').value;
        const percent_discount_on_sale = document.getElementById('percent_discount_on_sale').value;
        const status = document.getElementById('status').value;
        const site_id = document.querySelector("#datalistSite option[value='"+document.getElementById('site').value+"']").dataset.value;

        const object = {
            item_name,
            item_weapon,
            item_exterior,
            item_rarity,
            item_type,
            item_float,
            item_is_stattrak,
            item_has_sticker,
            item_is_souvenir,
            item_price_on_steam,
            purchase_price,
            percent_discount_on_purchase,
            sale_value,
            percent_discount_on_sale,
            status,
            site_id
        };

        $.ajax({
            url: '/api/v1/purchase-and-sales',
            type: 'POST',
            data: JSON.stringify(object),
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
                title: 'Register Item Failed!',
                icon: 'error',
                text: error.responseJSON.message,
                showConfirmButton: false,
            });
        }).always(() => {
    
        });
    }
});

