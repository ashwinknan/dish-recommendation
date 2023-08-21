import React from 'react';

function DishCard({ type, dish, ingredients }) {
    const ingredientString = ingredients[dish.Name];
    const ingredientArray = ingredientString ? ingredientString.split(',').map(ingredient => ingredient.trim()) : [];

    return (
        <div className="col-md-4">
            <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
                <div className="card-body">
                    <h5 className="card-title">{dish.Name}</h5>
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
