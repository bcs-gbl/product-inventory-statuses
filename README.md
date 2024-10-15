
# Product Inventory Statuses

This is a utility function designed to calculate the status of a product's availability based on its publication date and inventory across different warehouses. It can be used both in **Nuxt.js** applications (e.g., as a global utility) and in **AWS Node.js Lambdas**. 

## Installation

Install the package via npm:

```bash
npm install product-inventory-statuses
```

## Usage

### Importing and using the function in your project

You can use the `calculateProductStatus` function to calculate the status of the product.

### Parameters:
- **publicationdate** (`string | null`): The publication date of the product. If the date is unknown, use `"9999-12-31"` or `null`.
- **inventories** (`Array<object>`): An array of inventory objects. Each object should have:
  - **warehouseID** (`string`): The ID of the warehouse.
  - **inventoryAmount** (`number`): The amount of inventory in that warehouse.

### Return values:
The function returns different status codes depending on the inventory and the publication date:

- **10**: `"In Stock"` and also on sale (Not implemented yet, reserved for future use).
- **20**: `"In Stock"` (The product is available in the store).
- **30**: `"Orderable"` (The product is not in stock at the store but available at another warehouse).
- **40**: `"We accept pre-orders"` (The product is out of stock, but the publication date is in the future).
- **50**: `"Out of stock"` (The product is out of stock both at the store and the warehouse, and the publication date is past or now).
- **60**: `""` (No information, not available).

### Example usage in Nuxt.js:

You can place the utility function in the **utils** directory of your Nuxt app and use it globally. Here's an example of how you would use the package in a Nuxt.js application:

```javascript
// Import the function
import { calculateProductStatus } from 'product-inventory-statuses';

// Example inventory data
const inventories = [
  { warehouseID: '6a7528da-5096-4d0e-b864-08539b66c9fa', inventoryAmount: 10 },
  { warehouseID: 'other-warehouse-id', inventoryAmount: 5 }
];

// Call the function
const status = calculateProductStatus('2024-10-15', inventories);

console.log(status); // Output: 20, because there is stock in the store
```

### Example usage in AWS Lambda:

You can also use this utility in AWS Node.js Lambda functions:

```javascript
// Import the function
const { calculateProductStatus } = require('product-inventory-statuses');

exports.handler = async (event) => {
  const inventories = [
    { warehouseID: '6a7528da-5096-4d0e-b864-08539b66c9fa', inventoryAmount: 0 },
    { warehouseID: 'other-warehouse-id', inventoryAmount: 0 }
  ];

  const status = calculateProductStatus('2024-12-31', inventories);

  return {
    statusCode: 200,
    body: JSON.stringify({ status })
  };
};
```

## Publishing your package to npm

To publish this package to npm, follow these steps:

1. First, make sure you have a valid npm account. If you don't have one, create an account at [npmjs.com](https://www.npmjs.com/).
2. Login to npm:

```bash
npm login
```

3. Ensure your `package.json` file is correctly set up. Here's an example:

```json
{
  "name": "product-inventory-statuses",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "description": "Utility to calculate product availability status",
  "author": "Your Name",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

4. Publish the package:

```bash
npm publish
```

Once the package is published, you can install it in your projects by running:

```bash
npm install product-inventory-statuses
```

## License

This project is licensed under the MIT License.
