import React from 'react';
import copy from 'clipboard-copy';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import shareIcon from '../images/shareIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import Header from '../components/Header';

class FavoriteRecipes extends React.Component {
  constructor() {
    super();
    this.state = {
      allRecipes: [],
      favoriteRecipes: [],
      copyLink: false,
    };
    this.getFavoriteRecipes = this.getFavoriteRecipes.bind(this);
    this.onClickShare = this.onClickShare.bind(this);
  }

  componentDidMount() {
    this.getFavoriteRecipes();
  }

  onClickShare(link) {
    const startLink = window.location.href;
    const split = startLink.split('/r');
    copy(`${split[0]}${link}`);
    this.setState({
      copyLink: true,
    });
  }

  onClickFavoriteIcon(id) {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    const newArray = favoriteRecipes.filter((recipe) => recipe.id !== id);
    localStorage.setItem('favoriteRecipes', JSON.stringify(newArray));
    this.setState({
      favoriteRecipes: newArray,
    });
  }

  getFavoriteRecipes() {
    const favoriteRecipes = JSON.parse(localStorage.getItem('favoriteRecipes'));
    if (favoriteRecipes) {
      return this.setState({
        allRecipes: favoriteRecipes,
        favoriteRecipes,
      });
    }
    return null;
  }

  renderFavoriteRecipes() {
    const { favoriteRecipes, copyLink } = this.state;
    return favoriteRecipes.map((recipe, index) => {
      const link = `/${recipe.type}s/${recipe.id}`;
      const recipeInfo = `${recipe.area} - ${recipe.category}`;
      return (
        <section key={ recipe.id }>
          <Link to={ link }>
            <div className="container-img-favorite">
              <img
                data-testid={ `${index}-horizontal-image` }
                src={ recipe.image }
                alt={ recipe.name }
                className="img-favorite"
              />
            </div>
          </Link>
          <p className="text-recipe" data-testid={ `${index}-horizontal-top-text` }>
            {recipe.type === 'comida' ? recipeInfo : recipe.alcoholicOrNot }
          </p>
          <Link className="link-favorite" to={ link }>
            <p data-testid={ `${index}-horizontal-name` }>{recipe.name}</p>
          </Link>
          <p className="link-copy">{ copyLink ? 'Link copiado!' : null }</p>
          <div className="container-share-favorite">
            <button
              type="button"
              onClick={ () => this.onClickShare(link) }
              className="share-btn"
            >
              <img
                data-testid={ `${index}-horizontal-share-btn` }
                src={ shareIcon }
                alt="Compartilhar"
              />
            </button>
            <button
              type="button"
              onClick={ () => this.onClickFavoriteIcon(recipe.id) }
              className="favorite-btn"
            >
              <img
                src={ blackHeartIcon }
                alt="favorito"
                data-testid={ `${index}-horizontal-favorite-btn` }
              />
            </button>
          </div>
          <hr className="line-favorite" />
        </section>
      );
    });
  }

  renderFilterFavoriteRecipe(type) {
    const { allRecipes } = this.state;
    const filter = allRecipes.filter((recipe) => recipe.type === type);
    this.setState({
      favoriteRecipes: filter,
    });
  }

  render() {
    return (
      <section>
        <Header title="Receitas Favoritas" />
        <div className="container-btn">
          <button
            data-testid="filter-by-all-btn"
            type="button"
            onClick={ this.getFavoriteRecipes }
            className="main-btn"
          >
            All
          </button>
          <button
            data-testid="filter-by-food-btn"
            type="button"
            onClick={ () => this.renderFilterFavoriteRecipe('comida') }
            className="main-btn"
          >
            Food
          </button>
          <button
            data-testid="filter-by-drink-btn"
            type="button"
            onClick={ () => this.renderFilterFavoriteRecipe('bebida') }
            className="main-btn"
          >
            Drinks
          </button>
        </div>
        {this.renderFavoriteRecipes()}
      </section>
    );
  }
}

FavoriteRecipes.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default FavoriteRecipes;
