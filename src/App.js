import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DishCard from './components/DishCard'; // Import DishCard component
import SelectionHistory from './components/SelectionHistory'; // Import SelectionHistory component


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
        <div className="container mt-5">
            <div className="text-center mb-5">
                <h1>Ashwin's Dish Recommender System</h1>
                {!recommendations ? (
                    <button className="btn btn-primary mt-4" onClick={generateDishForToday}>Generate Dish for Today</button>
                ) : (
                    <div className="row mt-4">
                        {['breakfast', 'salad', 'lunchDinner'].map(type => (
                            <DishCard key={type} type={type} dish={recommendations[type]} /> // Use DishCard component
                        ))}
                    </div>
                )}
                <SelectionHistory selectedDishes={selectedDishes} /> // Use SelectionHistory component
            </div>
        </div>
    );
}

export default App;
