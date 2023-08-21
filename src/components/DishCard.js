import React, { useState } from 'react';
import { ReactComponent as RefreshIcon } from 'bootstrap-icons/icons/arrow-repeat.svg';
import { ReactComponent as RecipeIcon } from 'bootstrap-icons/icons/book.svg'; 
import { toTitleCase } from '../utils';

function DishCard({ type, dish, ingredients, onRefresh, viewRecipe, recipes }) {
    //const [showRecipeModal, setShowRecipeModal] = useState(false);
    const ingredientString = ingredients[dish.Name];
    const ingredientArray = ingredientString ? ingredientString.split(',').map(ingredient => toTitleCase(ingredient.trim())) : [];

    const handleViewRecipeClick = async (dishName) => {
        if (!recipes[dishName]) {
            await viewRecipe(dishName);
        }
    };

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
                    <div className="d-flex justify-content-center align-items-center mb-3">
                        <h5 className="card-title mb-0 d-inline">{dish.Name}</h5>
                        <button className="btn btn-sm btn-outline-primary ml-4" title="View Recipe" data-toggle="modal" data-target={`#recipeModal-${dish.Name}`} onClick={() => handleViewRecipeClick(dish.Name)}>
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
    
            <div className="modal fade" id={`recipeModal-${dish.Name}`} tabIndex="-1" role="dialog" aria-labelledby={`recipeModalLabel-${dish.Name}`} aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={`recipeModalLabel-${dish.Name}`}>Recipe for {dish.Name}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {recipes[dish.Name]}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );    
}

export default DishCard;
