import usersFromServer from './users';
import categoriesFromServer from './categories';
import productsFromServer from './products';

// const products = productsFromServer.map((product) => {
//   const category = null; // find by product.categoryId
//   const user = null; // find by category.ownerId

//   return null;
// });

export function getProducts({ selectedUserId, query }) {
  let products = productsFromServer.map((product) => {
    const productCategory = getCategoryById(product.categoryId);
    const categoryOwner = getUserById(productCategory.ownerId);

    const newProduct = {
      ...product,
      category: {
        ...productCategory,
        owner: {
          ...categoryOwner,
        },
      },
    };

    return newProduct;
  });

  if (query) {
    products = products.filter((product) => {
      const lcProductName = product.name.toLowerCase();
      const normalizedQuery = query.trim().toLowerCase();

      return lcProductName.includes(normalizedQuery);
    });
  }

  if (selectedUserId >= 0) {
    products = products.filter(
      product => product.category.owner.id === selectedUserId,
    );
  }

  return products;
}

export function getCategoryById(categoryId) {
  return categoriesFromServer.find(
    category => category.id === categoryId,
  );
}

export function getUsers() {
  return usersFromServer;
}

export function getUserById(userId) {
  return usersFromServer.find(user => user.id === userId);
}
