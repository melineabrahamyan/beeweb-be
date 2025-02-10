This backend project is built with NestJS, TypeScript, PostgreSQL, and TypeORM. It includes JWT authentication for user management and CRUD functionality for workspaces.


## Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js (LTS version recommended)** 
- **PostgreSQL (Ensure PostgreSQL is set up and running)**
- **npm (comes with Node.js)**

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/melineabrahamyan/beeweb-be.git
   ```

2. Navigate to the project directory:

   ```bash
   cd develop
   ```

3. Install the required dependencies using npm:

   ```bash
   npm install
   ```

## Environment Variables

Before running the project, you need to set up a `.env` file in the root of your project. You can use the `.env.dev.example` file as a reference.

```bash
cp .env.dev.example .env
```

## Database Setup

1. Create a PostgreSQL database (you can use a tool like pgAdmin or command-line to do this)

2. Update the .env file with your database connection details

## Running the Project

To start the project in **development** mode, use the following command:

```bash
npm run start:dev
```

To run the project in **production** mode, use:

```bash
npm start
```