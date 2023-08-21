import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function DishCard({ type, dish }) {
    return (
        <div className="col-md-4">
            <div className="card mb-4">
                {/* Title */}
                <div className="card-header bg-primary text-white dish-card-title">
                    {capitalizeFirstLetter(type)}
                </div>
                {/* Dish Name */}
                <h5 className="card-title dish-card-dish-name mt-3">{dish.Name}</h5>
                {/* Ingredients */}
                <ul className="list-group list-group-flush dish-card-ingredients">
                    {dish.Ingredients.map((ingredient, index) => (
                        <li key={index} className="list-group-item">{ingredient}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/Dinner$/, ' + Dinner');
}

export default DishCard;

