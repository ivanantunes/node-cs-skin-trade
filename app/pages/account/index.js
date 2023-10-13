new DataTable('#accountTable', {
    ajax: {
        url: '/api/v1/account',
        method: 'GET',
        beforeSend: (xhr) => {
            xhr.setRequestHeader('Authorization', `Bearer ${onGetSession().token}`);
        }
    },
    columns: [
        { data: 'id' },
        { data: 'name' },
        { data: 'url' },
        { data: 'datetime_create' },
        { data: 'datetime_update' },
        {
            data: null,
            orderable: false,
            defaultContent: `<button type='button' style="margin-right: 2%;" class='btn btn-dark editor_update'>`+
            `<i class="bi bi-pen-fill"></i>`+
            `</button>`+
            `<button type='button' class='btn btn-danger dowloandFile'>`+
            `<i class="bi bi-trash-fill"></i>`+
            `</button>`
        }
    ],
    processing: true,
    serverSide: true,
    responsive: true,
    select: false,
});
