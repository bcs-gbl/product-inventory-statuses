// CommonJS modul
function calculateProductStatus(publicationdate, inventories) {
  // DB FIX: hibás string kezelés:
  if (publicationdate === 'notset' || publicationdate === null) {
    publicationdate = '1000-01-01';
  }

  // inventory darabszámok:
  let shopc = 0; // bolti készlet
  let gardnersc = 0; // gardners raktárkészlet

  // inventory-k darabszámának számítása
  for (const inventory of inventories) {
    if (inventory.warehouseID === '6a7528da-5096-4d0e-b864-08539b66c9fa') {
      shopc += inventory.inventoryAmount;
    } else {
      gardnersc += inventory.inventoryAmount;
    }
  }

  // ha van a boltban, akkor "In Stock"
  if (shopc > 0) {
    // TODO: Ellenőrzés az akcióra, ha van, akkor visszaadjuk a 10-et.
    // 10: "In Stock" + akciós (ez nincs implementálva, csak a lehetőség fennáll)
    return 20; // 20: "In Stock" (eredeti: 1: "In Stock")
  }

  // ha nincs a boltban, de van a gardners-nél, akkor "Orderable"
  if (shopc < 1 && gardnersc > 0) {
    return 30; // 30: "Orderable" (eredeti: 2: "Orderable")
  }

  // ha nincs sehol készlet és ismeretlen a kiadás dátuma
  if (
    (publicationdate === '9999-12-31' || publicationdate === '1000-01-01') &&
    shopc < 1 &&
    gardnersc < 1
  ) {
    return 50; // 50: "Out of stock" (eredeti: 3: "Out of stock")
  }

  // ha nincs készlet és ismert a kiadás dátuma és később van, mint a mai nap
  const pupdate = new Date(publicationdate);
  if (!isNaN(pupdate.getTime())) {
    const now = new Date();
    if (shopc < 1 && gardnersc < 1 && pupdate > now) {
      return 40; // 40: "We accept pre-orders" (eredeti: 4: "We accept pre-orders")
    }
  }

  // ha nincs készlet és ismert a kiadás dátuma és korábban van, mint a mai nap
  if (shopc < 1 && gardnersc < 1 && pupdate <= now) {
    return 50; // 50: "Out of stock" (eredeti: 3: "Out of stock")
  }

  return 60; // 60: Alapértelmezett, nincs információ (eredeti: "")
}

module.exports = {
  calculateProductStatus
};
