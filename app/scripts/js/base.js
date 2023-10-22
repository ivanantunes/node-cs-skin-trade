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