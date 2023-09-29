(function (window) {
    window['env'] = window['env'] || {};
    window['env']['INVENTORY_URL'] = '${SYS_INVENTORY_URL}';
    window['env']['UPDATES_URL'] = '${SYS_UPDATES_URL}';
})(this);
