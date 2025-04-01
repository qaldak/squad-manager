# Squad Manager

Squad Manager is a tool designed to generate balanced player lineups for upcoming matches. It ensures that all players
participate equally, considering past match attendance and future absences. Training sessions are excluded from the
calculations.

## Features

* Balanced Player Selection: Ensures fair participation across matches.
* Absence Management: Accounts for future player unavailability.
* Database Support: Built with Supabase, including Role-Level Security (RLS).

## Project Structure

```
/
├── backend/ # Backend logic and API
├── frontend/ # Frontend application
├── database/schema/ # SQL scripts for database setup and RLS
```

## Environment Configuration

The backend requires an .env file with the following parameters:

```
SUPABASE_URL=foo.supabase.bar
SUPABASE_SERVICE_KEY=mySecretK4y
SUPABASE_LOGIN=foo@bar.baz
SUPABASE_PASSWORD=mySecretP4ssw0rd
LOG_LEVEL=debug
```

### Staging Environments

The app supports multiple .env files for different stages:

.env.dev for development<br>
.env.test for testing<br>
.env.prd for production

## Database

* Database: Supabase
* Schema: SQL scripts for table creation and RLS are located in /database/schema/.
* RLS: Currently supports a single user

## Getting started

1. Clone the repository:<br>
   ```
   git clone https://github.com/qaldak/squad-manager.git 
   ```

2. Navigate to the backend directory and set up the environment:
   ```
   cd backend
   cp .env.example .env
   ```
3. Install dependencies and start the application:
   ```
   npm install
   npm start
   ```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

