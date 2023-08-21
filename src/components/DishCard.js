import React from 'react';
import { ReactComponent as RefreshIcon } from 'bootstrap-icons/icons/arrow-repeat.svg';
import { ReactComponent as RecipeIcon } from 'bootstrap-icons/icons/book.svg'; // Import the recipe book icon
import { toTitleCase } from '../utils'; // Adjust the path if you place the utils.js in a subdirectory.


function DishCard({ type, dish, ingredients, onRefresh }) {
    const ingredientString = ingredients[dish.Name];
    const ingredientArray = ingredientString ? ingredientString.split(',').map(ingredient => toTitleCase(ingredient.trim())) : [];


    return (
        <div className="col-md-4">
            <div className="card mb-4">
                <div className="card-header bg-primary text-white d-flex align-items-center">
                    <div className="flex-grow-1 text-center">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                    <button className="btn-refresh" title="Generate another dish" onClick={() => onRefresh(type)}>
                        <RefreshIcon className="bi bi-arrow-repeat" />
                    </button>
                </div>

                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="card-title mb-0">{dish.Name}</h5>
                        <button className="btn btn-sm btn-outline-primary" title="View Recipe">
                            <RecipeIcon className="bi bi-book" />
                        </button>
                    </div>
                    {ingredientArray.length > 0 && (
                        <ul className="ingredient-list">
                            {ingredientArray.map((ingredient, index) => (
                                <li key={index} className="ingredient-item">{ingredient}</li>
                            ))}
                        </ul>
                    )}
                </div>

            </div>
        </div>
    );
}

export default DishCard;
