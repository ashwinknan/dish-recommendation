import React from 'react';

const SelectionHistory = ({ selectedDishes }) => (
    <div className="text-center mt-5">
        <h2>Selected Dishes</h2>
        {selectedDishes.map((dish, index) => (
            <div key={index} className="mt-4">
                <h3>{new Date().toLocaleDateString()}</h3>
                <p>Breakfast: {dish.breakfast.Name}</p>
                <p>Salad: {dish.salad.Name}</p>
                <p>Lunch/Dinner: {dish.lunchDinner.Name}</p>
            </div>
        ))}
    </div>
);

export default SelectionHistory;

