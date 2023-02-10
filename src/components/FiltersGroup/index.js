import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const onChangeSearch = event => {
    const {changeSearch} = props
    changeSearch(event.target.value)
  }
  const onKeyDownSearch = event => {
    const {enterSearch} = props
    if (event.key === 'Enter') {
      enterSearch()
    }
  }

  const renderSearchBar = () => {
    const {searchInput} = props
    return (
      <div className="search-container">
        <input
          type="search"
          placeholder="search"
          className="search-bar"
          value={searchInput}
          onChange={onChangeSearch}
          onKeyDown={onKeyDownSearch}
        />
        <BsSearch />
      </div>
    )
  }

  const renderCategoryOption = () => {
    const {categoryOptions} = props
    return categoryOptions.map(each => {
      const {activeCategoryId, getCategoryId} = props
      const onClickButtonCategory = () => getCategoryId(each.categoryId)
      const isActive = each.categoryId === activeCategoryId
      const className = isActive ? 'category active' : 'category'

      return (
        <li
          className="item-container"
          key={each.categoryId}
          onClick={onClickButtonCategory}
        >
          <p className={className}>{each.name}</p>
        </li>
      )
    })
  }

  const renderUnOrderList = () => (
    <>
      <h1 className="category-title">Category</h1>
      <ul className="list-container">{renderCategoryOption()}</ul>
    </>
  )

  const returnUnOrderList = () => {
    const {ratingsList} = props

    return ratingsList.map(each => {
      const {activeRatingId, getRatingId} = props
      const onClickButtonRating = () => getRatingId(each.ratingId)
      const isActive = each.ratingId === activeRatingId
      const className = isActive ? 'and-up action' : 'and-up'

      return (
        <li
          key={each.ratingId}
          className="item-container-rating"
          onClick={onClickButtonRating}
        >
          <img
            src={each.imageUrl}
            alt={`rating ${each.ratingId}`}
            className="rating-image"
          />
          <p className={className}>& up</p>
        </li>
      )
    })
  }

  const {clearFilter} = props

  const renderRatingsList = () => (
    <>
      <h1 className="category-title">Rating</h1>
      <ul className="list-container">{returnUnOrderList()}</ul>
    </>
  )

  return (
    <div className="filters-group-container">
      {renderSearchBar()}
      {renderUnOrderList()}
      {renderRatingsList()}
      <button className="button" type="button" onClick={clearFilter}>
        Clear Filters
      </button>
    </div>
  )
}

export default FiltersGroup
