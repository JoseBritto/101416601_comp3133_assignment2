const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Employee = require('./models/Employee');

const resolvers = {
    Query: {
        login: async (_, { username, email, password }) => {
            const user = await User.findOne({ $or: [{ username }, { email }] });
            if (!user) {
                throw new Error('User not found');
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new Error('Invalid credentials');
            }
            return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        },
        getAllEmployees: async () => {
            return await Employee.find();
        },
        searchEmployeeByEid: async (_, { id }) => {
            return await Employee.findById(id);
        },
        searchEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
            return await Employee.find({ $or: [{ designation }, { department }] });
        }
    },
    Mutation: {
        signup: async (_, { username, email, password }) => {
            const existingUser = await User.findOne({ $or: [{ username }, { email }] });
            if (existingUser) {
                throw new Error('User already exists');
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, email, password: hashedPassword });
            await user.save();
            return user;
        },
        addEmployee: async (_, {input}) => {
            const employee = new Employee(input);
            return await employee.save();
        },
        updateEmployeeByEid: async (_, { id, input }) => {
            return await Employee.findByIdAndUpdate(id, input, { new: true });
        },
        deleteEmployeeByEid: async (_, { id }) => {
            await Employee.findByIdAndDelete(id);
            return 'Employee deleted successfully';
        }
    }
};

module.exports = resolvers;
