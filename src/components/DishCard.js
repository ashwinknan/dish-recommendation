import React from 'react';

const dishDisplayNames = {
    breakfast: "Breakfast",
    salad: "Salad",
    lunchDinner: "Lunch + Dinner"
};

const DishCard = ({ type, dish }) => (
    <div className="col-md-4 mb-4">
        <div className="card h-100 shadow">
            <div className="card-body text-center">
                <h3 className="card-title">{dishDisplayNames[type]}</h3>
                <p className="card-text">{dish.Name}</p>
                <ul className="list-group list-group-flush">
                    {dish.Ingredients.map((ingredient, index) => (
                        <li key={index} className="list-group-item">{ingredient}</li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

export default DishCard;
