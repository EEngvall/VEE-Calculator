# VEE-Calculator

# Energy Usage Recalculation Project

## Overview

This project is designed to facilitate the recalculation of energy usage for customers when a meter failure occurs. It includes a web application with the ability to input and process customer information, bill segments, and generate recalculated bills.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [File Handling](#file-handling)
- [Contributing](#contributing)
- [License](#license)

## Features

### 1. Customer and Premise Information
- Input and store customer details including name, account number, and addresses.
- Specify mailing and premise addresses with city, state, and zip code information.
- Track additional details such as meter number and customer service representative name.

### 2. Bill Segment Management
- Dynamically add bill segments with start and end dates.
- Records usage data for each segment, broken down by individual years (e.g., 2020, 2021, 2022).
- Allows users to easily add, remove, and edit bill segments as needed.

### 3. Recalculation of Bills
- Implements logic to recalculate bills based on historical data and information from a new meter.
- Utilizes the provided recalculation algorithm to adjust for periods affected by meter failure.
- Displays recalculated values for each bill segment, including differences in billed amounts and usage.

### 4. Export and Import Functionality
- Enables users to export the entire dataset to a JSON file for backup or sharing purposes.
- Provides an option to import previously exported data, allowing users to resume work or transfer data between instances.

### 5. Real-time Updates and Validation
- Implements real-time updates for calculated values, ensuring users can see the impact of changes immediately.
- Performs input validation to ensure data integrity and prevent submission of incomplete or erroneous information.

### 6. User-Friendly Interface
- A clean and intuitive user interface to enhance user experience.
- Utilizes interactive elements, such as buttons and collapsible sections, to improve navigation.

### 7. Clear Summary and Reporting
- Generate a clear summary of recalculated bill segments with detailed information.
- Provide a summary section that displays total differences in billed amounts and usage.

### 8. Customization and Extensibility
- Allows users to customize settings such as time zone for date calculations.
- The application is structured for easy extensibility, making it straightforward to add new features or improvements.

### 10. Error Handling and User Feedback
- Implements robust error handling to gracefully handle unexpected scenarios.
- Provides informative feedback to users, guiding them in case of errors or incomplete submissions.


## Installation

1. Clone the repository:

```bash
git clone https://github.com/EEngvall/VEE-Calculator.git

# Use npm
npm install

# Or use yarn
yarn install

# Use npm
npm start

# Or use yarn
yarn start
```

## Usage

- Fill in the customer and premise information.
- Add bill segments with corresponding start/end dates and usage data.
- Recalculate bills to generate corrected values.
- Export and import data for record-keeping and future use.

## File Handling

Export Data:

- Click the "Export" button to save the current form data as a JSON file.
Import Data:

- Use the "Import" button to load previously exported data into the application.

# Contributing

Contributions are welcome! If you'd like to contribute to the project, please follow these steps:

- Fork the repository.
- Create a new branch for your feature or bug fix.
- Commit your changes.
- Push the branch to your fork.
- Open a pull request.

