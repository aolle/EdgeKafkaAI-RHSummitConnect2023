export const environment = {
    production: true,
    inventoryEndpointUrl: (window as any).env.INVENTORY_URL || 'http://localhost:8080/inventory',
    updatesEndpointUrl: (window as any).env.UPDATES_URL || 'http://localhost:8080/inventory/updates',
  };
