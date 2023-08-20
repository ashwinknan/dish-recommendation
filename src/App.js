import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

function App() {
    const [dishes, setDishes] = useState([]);
    const [recommendations, setRecommendations] = useState(null);
    const [selectedDishes, setSelectedDishes] = useState([]);

    useEffect(() => {
        fetch('/dish_database.xlsx')
            .then(response => response.arrayBuffer())
            .then(data => {
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                let dishesData = XLSX.utils.sheet_to_json(firstSheet);

                // Transform the data
                dishesData = transformDishes(dishesData);
                setDishes(dishesData);
            });
    }, []);

    function transformDishes(dishes) {
        const dishMap = new Map();

        dishes.forEach(dish => {
            if (!dishMap.has(dish.Name)) {
                dishMap.set(dish.Name, {
                    Name: dish.Name,
                    Type: dish.Type,
                    Ingredients: []
                });
            }
            dishMap.get(dish.Name).Ingredients.push(dish.Ingredients);
        });

        return Array.from(dishMap.values());
    }

    const generateDishForToday = () => {
        const breakfasts = dishes.filter(d => d.Type === "breakfast");
        const salads = dishes.filter(d => d.Type === "salad");
        const lunchAndDinner = dishes.filter(d => d.Type === "lunch + dinner");

        const randomDish = (type) => {
            if (type && type.length > 0) {
                return type[Math.floor(Math.random() * type.length)];
            }
            return null;
        }

        const breakfastDish = randomDish(breakfasts);
        const saladDish = randomDish(salads);
        const lunchDinnerDish = randomDish(lunchAndDinner);

        if (breakfastDish && saladDish && lunchDinnerDish) {
            setRecommendations({
                breakfast: breakfastDish,
                salad: saladDish,
                lunchDinner: lunchDinnerDish
            });
        } else {
            alert('One or more dish types have no entries. Please ensure there are dishes for each type in the Excel file.');
        }
    };

    const acceptRecommendation = () => {
        if (recommendations) {
            setSelectedDishes([...selectedDishes, recommendations]);
            setRecommendations(null);
        }
    };

    return (
        <div>
            {!recommendations ? (
                <button onClick={generateDishForToday}>Generate Dish for Today</button>
            ) : (
                <div>
                    {['breakfast', 'salad', 'lunchDinner'].map(type => {
                        const dish = recommendations[type];
                        return (
                            <div key={type}>
                                <h3>{type}</h3>
                                <p>{dish.Name}</p>
                                <ul>
                                    {dish.Ingredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                    <button onClick={acceptRecommendation}>Accept Recommendation</button>
                    <button onClick={() => setRecommendations(null)}>Reject Recommendation</button>
                </div>
            )}
            <div>
                <h2>Selected Dishes</h2>
                {selectedDishes.map((dish, index) => (
                    <div key={index}>
                        <h3>{new Date().toLocaleDateString()}</h3>
                        <p>Breakfast: {dish.breakfast.Name}</p>
                        <p>Salad: {dish.salad.Name}</p>
                        <p>Lunch/Dinner: {dish.lunchDinner.Name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
