const supabase = require('../config/supabase');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
    try {
        const stats = await Promise.all([
            supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'user'),
            supabase.from('lawyers').select('*', { count: 'exact', head: true }),
            supabase.from('lawyers').select('*', { count: 'exact', head: true }).eq('is_verified', true),
            supabase.from('lawyers').select('*', { count: 'exact', head: true }).eq('is_verified', false),
            supabase.from('documents').select('*', { count: 'exact', head: true }),
            supabase.from('documents').select('*', { count: 'exact', head: true }).eq('status', 'analyzed'),
            supabase.from('appointments').select('*', { count: 'exact', head: true }),
            supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'completed')
        ]);

        const [
            { count: totalUsers },
            { count: totalLawyers },
            { count: verifiedLawyers },
            { count: pendingVerification },
            { count: totalDocuments },
            { count: analyzedDocuments },
            { count: totalAppointments },
            { count: completedAppointments }
        ] = stats;

        // Recent users
        const { data: recentUsers } = await supabase
            .from('users')
            .select('id, name, email, role, created_at')
            .order('created_at', { ascending: false })
            .limit(5);

        // Recent appointments
        const { data: recentAppointments } = await supabase
            .from('appointments')
            .select('*, user:users(name), lawyer:lawyers(*, user_data:users(name))')
            .order('created_at', { ascending: false })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    lawyers: totalLawyers,
                    verifiedLawyers,
                    pendingVerification
                },
                documents: {
                    total: totalDocuments,
                    analyzed: analyzedDocuments
                },
                appointments: {
                    total: totalAppointments,
                    completed: completedAppointments
                },
                recent: {
                    users: recentUsers || [],
                    appointments: recentAppointments || []
                }
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
    try {
        const { role, isActive, page = 1, limit = 20 } = req.query;

        let query = supabase.from('users').select('*', { count: 'exact' });

        if (role) query = query.eq('role', role);
        if (isActive !== undefined) query = query.eq('is_active', isActive === 'true');

        const from = (parseInt(page) - 1) * parseInt(limit);
        const to = from + parseInt(limit) - 1;

        const { data: users, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        res.status(200).json({
            success: true,
            count: users.length,
            total: count,
            totalPages: Math.ceil((count || 0) / parseInt(limit)),
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res) => {
    try {
        const { isActive, role } = req.body;

        const { data: user, error } = await supabase
            .from('users')
            .update({ is_active: isActive, role })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error || !user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get pending lawyer verifications
// @route   GET /api/admin/lawyers/pending
// @access  Private (Admin)
exports.getPendingLawyers = async (req, res) => {
    try {
        const { data: lawyers, error } = await supabase
            .from('lawyers')
            .select('*, user:users(name, email, phone, created_at)')
            .eq('is_verified', false)
            .order('created_at', { ascending: true });

        if (error) throw error;

        res.status(200).json({
            success: true,
            count: lawyers.length,
            data: lawyers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Verify/Reject lawyer
// @route   PUT /api/admin/lawyers/:id/verify
// @access  Private (Admin)
exports.verifyLawyer = async (req, res) => {
    try {
        const { approved } = req.body;

        const updates = {
            is_verified: approved,
            verified_at: approved ? new Date() : null,
            verified_by: approved ? req.user.id : null
        };

        const { data: lawyer, error } = await supabase
            .from('lawyers')
            .update(updates)
            .eq('id', req.params.id)
            .select()
            .single();

        if (error || !lawyer) {
            return res.status(404).json({ success: false, message: 'Lawyer not found' });
        }

        res.status(200).json({
            success: true,
            message: approved ? 'Lawyer verified successfully' : 'Lawyer verification updated',
            data: lawyer
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get all lawyers (admin view)
// @route   GET /api/admin/lawyers
// @access  Private (Admin)
exports.getAllLawyers = async (req, res) => {
    try {
        const { isVerified, page = 1, limit = 20 } = req.query;

        let query = supabase.from('lawyers').select('*, user:users(name, email, phone, is_active)', { count: 'exact' });

        if (isVerified !== undefined) query = query.eq('is_verified', isVerified === 'true');

        const from = (parseInt(page) - 1) * parseInt(limit);
        const to = from + parseInt(limit) - 1;

        const { data: lawyers, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        res.status(200).json({
            success: true,
            count: lawyers.length,
            total: count,
            totalPages: Math.ceil((count || 0) / parseInt(limit)),
            data: lawyers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
