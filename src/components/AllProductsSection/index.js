import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiStatusResult = {
  initial: 'INITIAL',
  inProgress: 'IN PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    aplStatus: apiStatusResult.initial,
    activeOptionId: sortbyOptions[0].optionId,
    activeRatingId: '',
    activeCategoryId: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      aplStatus: apiStatusResult.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      activeRatingId,
      activeCategoryId,
      searchInput,
    } = this.state
    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&rating=${activeRatingId}&title_search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        aplStatus: apiStatusResult.success,
      })
    } else {
      this.setState({
        aplStatus: apiStatusResult.failure,
      })
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  renderProductsList = () => {
    const {productsList} = this.state
    const noProduct = productsList.length === 0

    // TODO: Add No Products Vie
    return (
      <div className="all-products-container">
        {noProduct ? (
          <>
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
              alt="no products"
              className="no-product"
            />
            <h1 className="title-oops">No Products Found</h1>
            <p className="description">
              We could not find any products. Try other filters.
            </p>
          </>
        ) : (
          this.renderProducts()
        )}
      </div>
    )
  }

  renderProducts = () => {
    const {productsList, activeOptionId} = this.state

    return (
      <>
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />
        <ul className="products-list">
          {productsList.map(product => (
            <ProductCard productData={product} key={product.id} />
          ))}
        </ul>
      </>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="failure-image"
      />
      <h1 className="title-oops">Oops! Something Went Wrong</h1>
      <p className="description ">
        We are having some trouble processing your request. Please try again.
      </p>
    </div>
  )

  getCategoryId = activeCategoryId => {
    this.setState({activeCategoryId}, this.getProducts)
  }

  getRatingId = activeRatingId => {
    this.setState({activeRatingId}, this.getProducts)
  }

  enterSearch = () => {
    this.getProducts()
  }

  changeSearch = searchInput => {
    this.setState({searchInput})
  }

  clearFilter = () => {
    this.setState(
      {
        activeRatingId: '',
        activeCategoryId: '',
        searchInput: '',
      },
      this.getProducts,
    )
  }

  renderAllProducts = () => {
    const {aplStatus} = this.state

    switch (aplStatus) {
      case apiStatusResult.success:
        return this.renderProductsList()
      case apiStatusResult.failure:
        return this.renderFailureView()
      case apiStatusResult.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {activeCategoryId, activeRatingId, searchInput} = this.state

    return (
      <div className="all-products-section">
        {/* TODO: Update the below element */}
        <FiltersGroup
          categoryOptions={categoryOptions}
          ratingsList={ratingsList}
          getCategoryId={this.getCategoryId}
          getRatingId={this.getRatingId}
          activeRatingId={activeRatingId}
          activeCategoryId={activeCategoryId}
          enterSearch={this.enterSearch}
          searchInput={searchInput}
          changeSearch={this.changeSearch}
          clearFilter={this.clearFilter}
        />

        {this.renderAllProducts()}
      </div>
    )
  }
}

export default AllProductsSection
