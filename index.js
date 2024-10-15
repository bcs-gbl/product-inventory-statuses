/**
 * 
 * Util: A rendelések státuszának kalkulálására szolgáló függvény
 * 
 *  params:
 *    - publicationdate: a kiadás dátuma (string vagy null)
 *    - inventories: egy tömb, ami az adott termék raktárkészletét mutatja
 * 
 *  returns:
 *    - 10: "In Stock" és még akciós is a termék (ez nincs implementálva, csak lehetőségként van itt)
 *    - 20: "In Stock" (tehát van bolti készlet)
 *    - 30: "Orderable" (tehát nincs bolti készlet, de van gardners készlet)
 *    - 40: "We accept pre-orders" (tehát ha nincs készlet és ismert a kiadás dátuma és az később van, mint a mai nap)
 *    - 50: "Out of stock" (tehát nincs készlet, nincs gardnersnél és a publikáció dátuma korábbi vagy most)
 *    - 60: "" azaz a default érték (tehát nincs információ és nem elérhető)
 * 
 *  Eredeti visszatérési értékek:
 *    - 1: "In Stock"
 *    - 2: "Orderable"
 *    - 3: "Out of stock"
 *    - 4: "We accept pre-orders"
 */

function calculateProductStatus(publicationdate = null, inventories = []) {

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

// a függvény exportálása
module.exports = {
calculateProductStatus
};
