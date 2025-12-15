# Emergency Hospital Optimization

Emergency Hospital Optimization is a frontend application designed to provide a user interface for an emergency hospital optimization system. The project focuses on visualizing and managing hospital workflows, resources, and emergency response operations efficiently.

The UI is based on a Figma design and is intended to be integrated with backend services or optimization algorithms in the future.

---

## 🎨 UI Design

The user interface for this project was designed in Figma:

🔗 https://www.figma.com/design/ElOeXcSFx4wsjvkuJ7TZp8/Emergency-Hospital-Optimization

---

## 🚀 Features

- Frontend UI for emergency hospital optimization
- Clean and responsive interface
- Built with modern frontend tooling
- Easily extendable for backend/API integration
- Suitable for academic and real-world optimization projects

---

## 🛠️ Technology Stack

| Tool / Framework     | Purpose                                     |
| -------------------- | ------------------------------------------- |
| **Vite**             | Build tool & dev server                     |
| **TypeScript**       | Type-safe development                       |
| **Web UI Framework** | React (or Vue / Svelte — update if needed)  |
| **Node.js / npm**    | Package management                          |


---

## 🧠 Optimization Algorithms Used

This project implements multiple optimization algorithms to determine the most suitable hospital for an emergency patient based on distance, hospital capacity, specialization, availability, and estimated travel time.

### 1. Greedy Algorithm
The greedy approach evaluates each hospital independently using a weighted scoring system. It selects the hospital with the highest overall score based on multiple criteria such as distance, capacity, specialization match, and availability. This algorithm is fast and suitable for real-time emergency decision-making.

### 2. A* Algorithm
The A* algorithm combines actual distance with a heuristic-based suitability score to determine the best hospital. It balances travel cost and hospital quality, making it more informed than a simple greedy approach and effective for optimal decision selection.

### 3. Genetic Algorithm
The genetic algorithm uses evolutionary principles such as selection and mutation to optimize hospital selection over multiple generations. Each hospital is treated as a chromosome, and fitness is evaluated using a multi-criteria scoring function. This method is well-suited for complex optimization problems with large search spaces.

### 4. Particle Swarm Optimization (PSO)
Particle Swarm Optimization models hospitals as particles moving through a solution space. Each particle updates its position based on personal and global best solutions, enabling fast convergence toward an optimal hospital selection. PSO is efficient for continuous and multi-dimensional optimization problems.


## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/MaheshReddy1514/Emergencyhospitaloptimization.git

