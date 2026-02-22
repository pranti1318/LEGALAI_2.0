const supabase = require('../config/supabase');
const { generateToken } = require('../middleware/auth');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, password, role, phone } = req.body;

        // Check if user exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const { data: user, error: userError } = await supabase
            .from('users')
            .insert([{
                name,
                email,
                password: hashedPassword,
                role: role || 'user',
                phone
            }])
            .select()
            .single();

        if (userError) throw userError;

        // If registering as lawyer, create lawyer profile
        if (role === 'lawyer') {
            const { error: lawyerError } = await supabase
                .from('lawyers')
                .insert([{
                    user_id: user.id,
                    specializations: [],
                    bar_number: 'PENDING',
                    experience: 0,
                    hourly_rate: 0
                }]);

            if (lawyerError) {
                console.error('Error creating lawyer profile:', lawyerError);
            }
        }

        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during registration'
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email and password'
            });
        }

        // Check for user
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (!user || error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        const token = generateToken(user.id);

        // Get lawyer profile if user is a lawyer
        let lawyerProfile = null;
        if (user.role === 'lawyer') {
            const { data: profile } = await supabase
                .from('lawyers')
                .select('id, is_verified')
                .eq('user_id', user.id)
                .single();
            lawyerProfile = profile;
        }

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                lawyerProfile: lawyerProfile ? {
                    id: lawyerProfile.id,
                    isVerified: lawyerProfile.is_verified
                } : null
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error || !user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        delete user.password; // Security

        let lawyerProfile = null;
        if (user.role === 'lawyer') {
            const { data: profile } = await supabase
                .from('lawyers')
                .select('*')
                .eq('user_id', user.id)
                .single();
            lawyerProfile = profile;
        }

        res.status(200).json({
            success: true,
            data: {
                ...user,
                lawyerProfile
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res) => {
    try {
        const { name, phone } = req.body;

        const { data: user, error } = await supabase
            .from('users')
            .update({ name, phone })
            .eq('id', req.user.id)
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const { data: user, error } = await supabase
            .from('users')
            .select('password')
            .eq('id', req.user.id)
            .single();

        if (error || !user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Check current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const { error: updateError } = await supabase
            .from('users')
            .update({ password: hashedPassword })
            .eq('id', req.user.id);

        if (updateError) throw updateError;

        const token = generateToken(req.user.id);

        res.status(200).json({
            success: true,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
