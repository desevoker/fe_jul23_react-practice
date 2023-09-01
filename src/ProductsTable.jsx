import classNames from 'classnames';
import React from 'react';

export const ProductsTable = ({
  products,
  isReversed,
  sortType,
  setIsReversed,
  setSortType,
}) => {
  function handleSort(newSortType) {
    const isFirstClick = sortType !== newSortType;
    const isSecondClick = newSortType === sortType && !isReversed;
    const isThirdClick = newSortType === sortType && isReversed;

    if (isFirstClick) {
      setSortType(newSortType);
      setIsReversed(false);
    }

    if (isSecondClick) {
      setIsReversed(true);
    }

    if (isThirdClick) {
      setSortType('');
      setIsReversed(false);
    }
  }

  return (
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
                  <i
                    data-cy="SortIcon"
                    className={classNames('fas', {
                      'fa-sort': sortType !== 'ID',
                      'fa-sort-up': sortType === 'ID' && !isReversed,
                      'fa-sort-down': sortType === 'ID' && isReversed,
                    })}
                    onClick={() => {
                      handleSort('ID');
                    }}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Product

              <a href="#/">
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={classNames('fas', {
                      'fa-sort': sortType !== 'Product',
                      'fa-sort-up': sortType === 'Product' && !isReversed,
                      'fa-sort-down': sortType === 'Product' && isReversed,
                    })}
                    onClick={() => {
                      handleSort('Product');
                    }}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Category

              <a href="#/">
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={classNames('fas', {
                      'fa-sort': sortType !== 'Category',
                      'fa-sort-up': sortType === 'Category' && !isReversed,
                      'fa-sort-down': sortType === 'Category' && isReversed,
                    })}
                    onClick={() => {
                      handleSort('Category');
                    }}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              User

              <a href="#/">
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={classNames('fas', {
                      'fa-sort': sortType !== 'User',
                      'fa-sort-up': sortType === 'User' && !isReversed,
                      'fa-sort-down': sortType === 'User' && isReversed,
                    })}
                    onClick={() => {
                      handleSort('User');
                    }}
                  />
                </span>
              </a>
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        {products.map(({ category, user, ...product }) => (
          <tr data-cy="Product" key={product.id}>
            <td className="has-text-weight-bold" data-cy="ProductId">
              {product.id}
            </td>

            <td data-cy="ProductName">
              {product.name}
            </td>

            <td data-cy="ProductCategory">
              {`${category.icon} - ${category.title}`}
            </td>

            <td
              data-cy="ProductUser"
              className={classNames({
                'has-text-danger': user.sex === 'f',
                'has-text-link': user.sex === 'm',
              })}
            >
              {user.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
