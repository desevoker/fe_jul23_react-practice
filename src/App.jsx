import React, { useState } from 'react';
import './App.scss';

import cn from 'classnames';
import { getCategories, getProducts, getUsers } from './api/apiService';

export const App = () => {
  const [selectedUserId, setSelectedUserId] = useState(-1);
  const [selectedCategoriesIds, setSelectedCategoriesIds] = useState([]);
  const [query, setQuery] = useState('');

  const users = getUsers();
  const categories = getCategories();
  const products = getProducts({
    selectedUserId,
    selectedCategoriesIds,
    query,
  });

  const handleCategoryOnclick = (categoryId) => {
    if (selectedCategoriesIds.includes(categoryId)) {
      setSelectedCategoriesIds(
        selectedCategoriesIds.filter(
          selectedCateegoryId => selectedCateegoryId !== categoryId,
        ),
      );
    } else {
      setSelectedCategoriesIds([...selectedCategoriesIds, categoryId]);
    }
  };

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
                className={cn({
                  'is-active': selectedUserId === -1,
                })}
                onClick={() => setSelectedUserId(-1)}
              >
                All
              </a>

              {users.map(user => (
                <a
                  key={user.id}
                  className={cn({
                    'is-active': selectedUserId === user.id,
                  })}
                  onClick={() => setSelectedUserId(user.id)}
                  data-cy="FilterUser"
                  href="#/"
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
                  onChange={e => setQuery(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {!!query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button', 'is-success', 'mr-6', {
                  'is-outlined': !!selectedCategoriesIds.length,
                })}
                onClick={() => setSelectedCategoriesIds([])}
              >
                All
              </a>

              {categories.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={cn('button', 'mr-2', 'my-1', {
                    'is-info': selectedCategoriesIds.includes(category.id),
                  })}
                  onClick={() => handleCategoryOnclick(category.id)}
                  href="#/"
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
                  setSelectedUserId(-1);
                  setQuery('');
                  setSelectedCategoriesIds([]);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {products.length ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.map(product => (
                  <tr key={product.id} data-cy="Product">
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">
                      {product.name}
                    </td>

                    <td data-cy="ProductCategory">
                      {`${product.category.icon} - ${product.category.title}`}
                    </td>

                    <td
                      data-cy="ProductUser"
                      className={cn({
                        'has-text-link': product.category.owner.sex === 'm',
                        'has-text-danger': product.category.owner.sex === 'f',
                      })}
                    >
                      {product.category.owner.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
