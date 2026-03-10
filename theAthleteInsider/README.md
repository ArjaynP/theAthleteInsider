# theAthleteInsider

## Overview

theAthleteInsider is a web application designed to provide users with up-to-date information about NBA teams. It leverages caching mechanisms to optimize data retrieval and enhance performance. The application is built using Next.js, a React framework that enables server-side rendering and static site generation.

## Project Structure

- **app/api/teams/route.ts**: This file contains the API route for fetching NBA teams. It exports a `GET` function that retrieves a cached list of NBA teams and returns it in JSON format. If an error occurs during data retrieval, it responds with a 500 status code and an error message.

- **lib/cachedSportsData.ts**: This file includes the logic for fetching and caching NBA teams data. It defines the `getCachedNBATeamsList` function, which retrieves the teams from a cache or fetches them from an external source if not available in the cache.

- **package.json**: This file contains metadata about the project, including dependencies, scripts, and project configuration. It is essential for managing the project's packages and running scripts.

- **tsconfig.json**: This file is the TypeScript configuration file. It specifies the compiler options and the files to include in the compilation, ensuring that the TypeScript code is compiled correctly.

- **next.config.ts**: This file contains the configuration settings for the Next.js application. It allows customization of various aspects of the Next.js framework, such as routing and performance optimizations.

- **README.md**: This file provides documentation for the project, including setup instructions, usage, and contribution guidelines.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/ArjaynP/theAthleteInsider.git
   ```

2. Navigate to the project directory:
   ```
   cd theAthleteInsider
   ```

3. Install the dependencies:
   ```
   npm install
   ```

4. Run the development server:
   ```
   npm run dev
   ```

## Usage

Once the server is running, you can access the API endpoint to fetch NBA teams at:
```
http://localhost:3000/api/teams
```

This endpoint will return a JSON response containing the list of NBA teams. In case of an error, it will return a 500 status code along with an error message.

## Contributing

Contributions are welcome! If you would like to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your branch to your forked repository.
5. Create a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.