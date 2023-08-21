import React from 'react';

function DishCard({ type, dish, ingredients }) {
    return (
        <div className="col-md-4">
            <div className="card mb-4">
                <div className="card-header bg-primary text-white">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                </div>
                <div className="card-body">
                    <h5 className="card-title">{dish.Name}</h5>
                    {ingredients[dish.Name] && <p className="card-text">{ingredients[dish.Name]}</p>}
                </div>
            </div>
        </div>
    );
}

export default DishCard;




