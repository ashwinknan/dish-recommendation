import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


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
        <div className="container-fluid bg-gradient">

            <h1 className="text-center mt-5 font-title">Ashwin's Dish Recommender System</h1>

            {!recommendations ? (
                <div className="d-flex justify-content-center mt-5">
                    <button className="btn btn-primary" onClick={generateDishForToday}>
                        Generate Dish for Today
                    </button>
                </div>
            ) : (
                <>
                    <div className="row mt-5">
                        {['breakfast', 'salad', 'lunchDinner'].map(type => {
                            const dish = recommendations[type];
                            return (
                                <div key={type} className="col-md-4">
                                    <div className="card mb-4 shadow-sm">
                                        <div className="card-header">
                                            <h4 className="my-0 font-weight-normal text-center">{type}</h4>
                                        </div>
                                        <div className="card-body text-center">
                                            <h2 className="card-title text-center">{dish.Name}</h2>
                                            <ul className="list-unstyled mt-3 mb-4">
                                                {dish.Ingredients.map((ingredient, index) => (
                                                    <li key={index}>{ingredient}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="d-flex justify-content-center mt-4">
                        <button className="btn btn-success mx-2" onClick={acceptRecommendation}>
                            Accept Recommendation
                        </button>
                        <button className="btn btn-danger mx-2" onClick={() => setRecommendations(null)}>
                            Reject Recommendation
                        </button>
                    </div>
                </>
            )}

            <div className="mt-5 text-center">
                <h2>Selected Dishes</h2>
                <div className="d-flex justify-content-center flex-wrap">
                {selectedDishes.map((dish, index) => (
                    <div key={index} className="m-2">
                        <h3>{new Date().toLocaleDateString()}</h3>
                        <p>Breakfast: {dish.breakfast.Name}</p>
                        <p>Salad: {dish.salad.Name}</p>
                        <p>Lunch/Dinner: {dish.lunchDinner.Name}</p>
                    </div>
                ))}
                </div>
            </div>
        </div>
    );
}

export default App;
