import usersFromServer from './users';
import categoriesFromServer from './categories';
import productsFromServer from './products';

export function getProducts({
  selectedUserId,
  selectedCategoriesIds,
  query,
}) {
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

  if (selectedUserId >= 0) {
    products = products.filter(
      product => product.category.owner.id === selectedUserId,
    );
  }

  if (selectedCategoriesIds?.length) {
    products = products.filter(
      product => selectedCategoriesIds.includes(product.category.id),
    );
  }

  if (query) {
    products = products.filter((product) => {
      const lcProductName = product.name.toLowerCase();
      const normalizedQuery = query.trim().toLowerCase();

      return lcProductName.includes(normalizedQuery);
    });
  }

  return products;
}

export function getUsers() {
  return usersFromServer;
}

export function getCategories() {
  return categoriesFromServer;
}

function getCategoryById(categoryId) {
  return categoriesFromServer.find(
    category => category.id === categoryId,
  );
}

function getUserById(userId) {
  return usersFromServer.find(user => user.id === userId);
}
