import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { ProductsTable } from './ProductsTable';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(
    ({ id }) => id === product.categoryId,
  );
  const user = usersFromServer.find(
    ({ id }) => category?.ownerId === id,
  );

  return {
    ...product,
    category,
    user,
  };
});

function getPreparedProducts(
  initialProducts,
  {
    selectedUserId,
    query,
    selectedCategories,
    sortType,
    isReversed,
  },
) {
  let visibleProducts = [...initialProducts];

  if (selectedUserId) {
    visibleProducts = visibleProducts.filter(
      product => product.user.id === selectedUserId,
    );
  }

  if (query) {
    const normalizedQuery = query.trim().toLowerCase();

    visibleProducts = visibleProducts.filter(
      product => product.name.toLowerCase().includes(normalizedQuery),
    );
  }

  if (selectedCategories.length !== 0) {
    visibleProducts = visibleProducts.filter(
      product => selectedCategories.includes(product.categoryId),
    );
  }

  if (sortType) {
    visibleProducts.sort((a, b) => {
      switch (sortType) {
        case 'ID':
          return a.id - b.id;
        case 'Product':
          return a.name.localeCompare(b.name);
        case 'Category':
          return a.category.title.localeCompare(b.category.title);
        case 'User':
          return a.user.name.localeCompare(b.user.name);
        default:
          return 0;
      }
    });
  }

  if (isReversed) {
    visibleProducts.reverse();
  }

  return visibleProducts;
}

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortType, setSortType] = useState('');
  const [isReversed, setIsReversed] = useState(false);

  const visibleProducts = getPreparedProducts(
    products,
    {
      selectedUserId,
      query,
      selectedCategories,
      sortType,
      isReversed,
    },
  );

  function isCategorySelected(categoryId) {
    return selectedCategories.includes(categoryId);
  }

  function handleCategoryToggle(categoryId) {
    if (isCategorySelected(categoryId)) {
      setSelectedCategories(prevState => prevState.filter(
        id => (id !== categoryId),
      ));
    } else {
      setSelectedCategories(prevState => [...prevState, categoryId]);
    }
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={classNames({
                  'is-active': !selectedUserId,
                })}
                onClick={() => {
                  setSelectedUserId(0);
                }}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  className={classNames({
                    'is-active': user.id === selectedUserId,
                  })}
                  key={user.id}
                  onClick={() => {
                    setSelectedUserId(user.id);
                  }}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => {
                        setQuery('');
                      }}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames('button is-success mr-6', {
                  'is-outlined': selectedCategories.length,
                })}
                onClick={() => {
                  setSelectedCategories([]);
                }}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  className={classNames('button mr-2 my-1', {
                    'is-info': isCategorySelected(category.id),
                  })}
                  href="#/"
                  onClick={() => {
                    handleCategoryToggle(category.id);
                  }}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setSelectedUserId(0);
                  setQuery('');
                  setSelectedCategories([]);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : (
              <ProductsTable
                products={visibleProducts}
                isReversed={isReversed}
                sortType={sortType}
                setIsReversed={setIsReversed}
                setSortType={setSortType}
              />
            )
          }
        </div>
      </div>
    </div>
  );
};
