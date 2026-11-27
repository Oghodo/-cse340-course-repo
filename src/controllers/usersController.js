
import bcrypt from 'bcrypt';

import {
    createUser,
    authenticateUser,
    getAllUsers
} from '../models/users.js';

// Display the registration form
const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

// Process user registration
const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        await createUser(name, email, passwordHash);

        // Redirect after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        return res.redirect('/login');

    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        return res.redirect('/register');
    }
};

// Display the login form
const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

// Process user login
const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/login');
        }

        // Regenerate session ID after successful authentication
        req.session.regenerate((error) => {
            if (error) {
                console.error('Error regenerating session:', error);
                return res.redirect('/login');
            }

            // Store authenticated user information in the new session
            req.session.user = user;

            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in successfully:', user.user_id);
            }

            // Save session before redirecting
            req.session.save((saveError) => {
                if (saveError) {
                    console.error('Error saving session:', saveError);
                    return res.redirect('/login');
                }

                return res.redirect('/dashboard');
            });
        });

    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        return res.redirect('/login');
    }
};

// Process user logout
const processLogout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Error destroying session:', error);
            return res.redirect('/dashboard');
        }

        return res.redirect('/login');
    });
};

// Middleware to protect routes that require login
const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    next();
};

/**
 * Middleware factory to require a specific role for route access.
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/dashboard');
        }

        // User has the required role
        next();
    };
};

// Display the user's dashboard
const showDashboard = (req, res) => {
    const user = req.session.user;

    res.render('dashboard', {
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

/**
 * Display all registered users.
 */
const showUsers = async (req, res, next) => {
    try {
        const users = await getAllUsers();

        res.render('users', {
            title: 'Registered Users',
            users
        });

    } catch (error) {
        console.error('Error displaying registered users:', error);
        next(error);
    }
};

// Export controller functions
export {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    requireRole,
    showDashboard,
    showUsers
};
