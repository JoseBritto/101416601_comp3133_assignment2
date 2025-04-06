## Installation and Setup
1. **Clone the repository**:
   ```sh
   git clone https://github.com/JoseBritto/comp3133__101416601_assigment1.git
   cd comp3133__101416601_assigment1
   ```
2. **Install dependencies**:
   ```sh
   npm install
   ```
3. **Configure environment variables**:
   Replace the `.env` file in the root directory and with the relevant info:
   ```sh
   PORT=4000
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
4. **Start the server**:
   ```sh
   npm start
   ```

## API Endpoints
### Queries
- `login(username: String, email: String, password: String): String` - Authenticates user and returns JWT.
- `getAllEmployees: [Employee]` - Fetches all employees.
- `searchEmployeeByEid(id: ID!): Employee` - Retrieves employee by ID.
- `searchEmployeeByDesignationOrDepartment(designation: String, department: String): [Employee]` - Searches employees by designation or department.

### Mutations
- `signup(username: String!, email: String!, password: String!): User` - Registers a new user.
- `addEmployee(input: EmployeeInput!): Employee` - Adds a new employee.
- `updateEmployeeByEid(id: ID!, input: EmployeeInput!): Employee` - Updates an existing employee.
- `deleteEmployeeByEid(id: ID!): String` - Deletes an employee by ID.

## Testing the API
Use **Postman** or **GraphQL Playground** to test queries and mutations.
- Access GraphQL Playground at: `http://localhost:4000/graphql`

