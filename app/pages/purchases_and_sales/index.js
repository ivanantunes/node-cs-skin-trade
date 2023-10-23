function formatDataTable(data) {
    return (
        `<dl>
            <dd><strong>Item Weapon:</strong> ${data.item_weapon}</dd>
            <dd><strong>Item Exterior:</strong> ${itemExteriorFormat(data.item_exterior)}</dd>
            <dd><strong>Item Rarity:</strong> ${itemRarityFormat(data.item_rarity)}</dd>
            <dd><strong>Item Type:</strong> ${data.item_type}</dd>
            <dd><strong>Item Float:</strong> ${data.item_float || 'Undefined'}</dd>
            <dd><strong>Item is Stattrak:</strong> ${toBoolFormat(data.item_is_stattrak)}</dd>
            <dd><strong>Item has Sticker:</strong> ${toBoolFormat(data.item_has_sticker)}</dd>
            <dd><strong>Item is Souvenir:</strong> ${toBoolFormat(data.item_is_souvenir)}</dd>
            <dd><strong>Sales Commission:</strong> ${Number(data.sales_commission_percent).toFixed(2)}%</dd>
            <dd><strong>Fee Withdraw:</strong> ${Number(data.fee_withdraw_percent).toFixed(2)}%</dd>
            <dd><strong>Site:</strong> ${data.site.title}</dd>
            <dd><strong>Account:</strong> ${data.site.account.name}</dd>
            <dd><strong>Dt. Create:</strong> ${new Date(data.datetime_create).toLocaleString().replace(',', '')}</dd>
            <dd><strong>Dt. Update:</strong> ${new Date(data.datetime_update).toLocaleString().replace(',', '')}</dd>
        </dl>`
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

function itemExteriorFormat(type) {
    switch (type) {
        case 'FN':
            return 'Factory New';
        case 'MW':
            return 'Minimal Wear';
        case 'FT':
            return 'Field-Tested';
        case 'WW':
            return 'Well-Worm';
        case 'BS':
            return 'Battle-Scarred';
        default:
            return 'Undefined';
    }
}

function itemRarityFormat(rarity) {
    switch (rarity) {
        case 'CG':
            return 'Consumer Grade';
        case 'IG':
            return 'Industrial Grade';
        case 'MSG':
            return 'Mil-Spec Grade';
        case 'RE':
            return 'Restricted';
        case 'CL':
            return 'Classified';
        case 'CO':
            return 'Covert'
        default:
            return 'Undefined';
    }
}

function statusFormat(status) {
    switch (status) {
        case 'purchase':
            return 'Purchase';
        case 'sold':
            return 'Sold';
        case 'steam_inventory':
            return 'Steam Inventory';
        case 'site_inventory':
            return 'Site Inventory';
        case 'for_sale':
            return 'For Sale';
        default:
            return 'Undefined';
    }
}

function toBoolFormat(bool) {
    return bool ? 'Yes' : 'No';
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
            {
                data: 'status',
                render: (data, type, full, meta) => {
                    return statusFormat(data);
                }
            },
            {
                data: null,
                orderable: false,
                render: (data, type, full, meta) => {
                    return `<button type='button' class='btn btn-secondary-custom edit' data-bs-toggle="modal" data-bs-target="#formEditModal" ${data.status === 'for_sale' ? 'disabled' : ''}>
                                <i class="bi bi-pen-fill"></i>
                            </button>
                            <button type='button' class='btn btn-close-modal delete'>
                                <i class="bi bi-trash-fill"></i>
                            </button>`
                },
            }
        ],
        processing: true,
        serverSide: true,
        responsive: true,
        select: false
    }).on('click', 'td.dt-control', (e) => {
        let tr = e.target.closest('tr');
        let row = table.row(tr);

        if (row.child.isShown()) {
            row.child.hide();
        } else {
            row.child(formatDataTable(row.data())).show();
        }
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

    table.on('click', 'button.edit', (e) => {
        const formsEdits = document.querySelectorAll('#formEdit');

        Array.prototype.slice.call(formsEdits).forEach((form) => {
            form.addEventListener('submit', (event) => {
                event.preventDefault();
                event.stopPropagation();
    
                if (form.checkValidity()) {
                    console.log('save edi')
                    onEdit(data.id);
                }
    
                form.classList.add('was-validated');
            }, false)
        });

        const data = table.row(e.target.closest('tr')).data();
        
        document.getElementById('item_nameEdit').value = data.item_name;
        document.getElementById('item_weaponEdit').value = data.item_weapon;
        document.getElementById('item_exteriorEdit').value = data.item_exterior;
        document.getElementById('item_rarityEdit').value = data.item_rarity;
        document.getElementById('item_typeEdit').value = data.item_type;
        document.getElementById('item_floatEdit').value = data.item_float;
        document.getElementById('item_is_stattrakEdit').value = data.item_is_stattrak;
        document.getElementById('item_has_stickerEdit').value = data.item_has_sticker;
        document.getElementById('item_is_souvenirEdit').value = data.item_is_souvenir;
        document.getElementById('item_price_on_steamEdit').value = data.item_price_on_steam;
        document.getElementById('purchase_priceEdit').value = data.purchase_price;
        document.getElementById('percent_discount_on_purchaseEdit').value = data.percent_discount_on_purchase;
        document.getElementById('sale_valueEdit').value = data.sale_value;
        document.getElementById('percent_discount_on_saleEdit').value = data.percent_discount_on_sale;
        document.getElementById('statusEdit').value = data.status;
        document.getElementById('siteEdit').value = data.site.title;
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

    function onEdit(id) {
        onLoading(true);
    
        const item_name = document.getElementById('item_nameEdit').value;
        const item_weapon = document.getElementById('item_weaponEdit').value;
        const item_exterior = document.getElementById('item_exteriorEdit').value || null;
        const item_rarity = document.getElementById('item_rarityEdit').value || null;
        const item_type = document.getElementById('item_typeEdit').value || null;
        const item_float = document.getElementById('item_floatEdit').value || null;
        const item_is_stattrak = document.getElementById('item_is_stattrakEdit').value === 'true';
        const item_has_sticker = document.getElementById('item_has_stickerEdit').value === 'true';
        const item_is_souvenir = document.getElementById('item_is_souvenirEdit').value === 'true';
        const item_price_on_steam = document.getElementById('item_price_on_steamEdit').value;
        const purchase_price = document.getElementById('purchase_priceEdit').value;
        const percent_discount_on_purchase = document.getElementById('percent_discount_on_purchaseEdit').value;
        const sale_value = document.getElementById('sale_valueEdit').value;
        const percent_discount_on_sale = document.getElementById('percent_discount_on_saleEdit').value;
        const status = document.getElementById('statusEdit').value;
        const site_id = document.querySelector("#datalistSite option[value='"+document.getElementById('siteEdit').value+"']").dataset.value;

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
            url: `/api/v1/purchase-and-sales/${id}`,
            type: 'PUT',
            data: JSON.stringify(object),
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
                title: 'Update Item Failed!',
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
            url: `/api/v1/purchase-and-sales/${id}`,
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
                title: 'Delete Item Failed!',
                icon: 'error',
                text: error.responseJSON.message,
                showConfirmButton: false,
            });
        }).always(() => {
    
        });
    }
});

