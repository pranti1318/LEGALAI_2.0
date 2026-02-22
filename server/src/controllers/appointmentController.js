const supabase = require('../config/supabase');

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private (User)
exports.createAppointment = async (req, res) => {
    try {
        const { lawyerId, documentId, scheduledDate, timeSlot, purpose, amount } = req.body;

        // Verify lawyer exists and is verified
        const { data: lawyer, error: lawyerError } = await supabase
            .from('lawyers')
            .select('id, is_verified, hourly_rate')
            .eq('id', lawyerId)
            .single();

        if (lawyerError || !lawyer) {
            return res.status(404).json({ success: false, message: 'Lawyer not found' });
        }

        if (!lawyer.is_verified) {
            return res.status(400).json({ success: false, message: 'Cannot book appointment with unverified lawyer' });
        }

        // Create appointment record
        const { data: appointment, error } = await supabase
            .from('appointments')
            .insert([{
                user_id: req.user.id,
                lawyer_id: lawyerId,
                date: scheduledDate,
                time_slot: typeof timeSlot === 'object' ? JSON.stringify(timeSlot) : timeSlot,
                purpose,
                amount: amount || lawyer.hourly_rate,
                status: 'scheduled'
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error creating appointment' });
    }
};

// @desc    Get user's appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
    try {
        const { status, upcoming, page = 1, limit = 10 } = req.query;

        let query = supabase
            .from('appointments')
            .select('*, user:users(name, email, avatar), lawyer:lawyers(*, user_user:users(name, email, avatar))');

        // Filter based on role
        if (req.user.role === 'lawyer') {
            const { data: lawyer } = await supabase
                .from('lawyers')
                .select('id')
                .eq('user_id', req.user.id)
                .single();

            if (lawyer) query = query.eq('lawyer_id', lawyer.id);
        } else {
            query = query.eq('user_id', req.user.id);
        }

        if (status) query = query.eq('status', status);

        if (upcoming === 'true') {
            query = query.gte('date', new Date().toISOString().split('T')[0]);
            query = query.in('status', ['scheduled', 'pending']);
        }

        const from = (parseInt(page) - 1) * parseInt(limit);
        const to = from + parseInt(limit) - 1;

        const { data: appointments, error, count } = await query
            .order('date', { ascending: false })
            .range(from, to);

        if (error) throw error;

        res.status(200).json({
            success: true,
            count: appointments.length,
            total: count,
            totalPages: Math.ceil((count || 0) / parseInt(limit)),
            data: appointments
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res) => {
    try {
        const { data: appointment, error } = await supabase
            .from('appointments')
            .select('*, user:users(name, email, avatar, phone), lawyer:lawyers(*, lawyer_user:users(name, email, avatar, phone))')
            .eq('id', req.params.id)
            .single();

        if (error || !appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        // Authorization check
        const { data: lawyer } = await supabase
            .from('lawyers')
            .select('id')
            .eq('user_id', req.user.id)
            .single();

        const isLawyer = lawyer && appointment.lawyer_id === lawyer.id;
        const isUser = appointment.user_id === req.user.id;
        const isAdmin = req.user.role === 'admin';

        if (!isUser && !isLawyer && !isAdmin) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update appointment status (Lawyer)
// @route   PUT /api/appointments/:id/status
// @access  Private (Lawyer)
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status, meetingLink, notes } = req.body;

        const { data: lawyer } = await supabase
            .from('lawyers')
            .select('id')
            .eq('user_id', req.user.id)
            .single();

        if (!lawyer) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const { data: appointment, error } = await supabase
            .from('appointments')
            .update({
                status,
                meeting_link: meetingLink,
                notes: notes
            })
            .match({ id: req.params.id, lawyer_id: lawyer.id })
            .select()
            .single();

        if (error || !appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found or not owned by you' });
        }

        // Increment consultation count if completed
        if (status === 'completed') {
            await supabase.rpc('increment_consultation_count', { lawyer_id_input: lawyer.id });
        }

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Cancel appointment
// @route   PUT /api/appointments/:id/cancel
// @access  Private
exports.cancelAppointment = async (req, res) => {
    try {
        const { data: appointment, error: fetchError } = await supabase
            .from('appointments')
            .select('id, user_id, lawyer_id, status')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !appointment) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        const { data: lawyer } = await supabase
            .from('lawyers')
            .select('id')
            .eq('user_id', req.user.id)
            .single();

        const isLawyer = lawyer && appointment.lawyer_id === lawyer.id;
        const isUser = appointment.user_id === req.user.id;

        if (!isUser && !isLawyer) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const { data: canceledApp, error } = await supabase
            .from('appointments')
            .update({ status: 'cancelled' })
            .eq('id', req.params.id)
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({
            success: true,
            data: canceledApp
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
