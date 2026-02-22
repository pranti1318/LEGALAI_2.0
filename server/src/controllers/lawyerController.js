const supabase = require('../config/supabase');
const geoapifyMapsService = require('../services/googleMapsService');

// @desc    Get all verified lawyers (with filters)
// @route   GET /api/lawyers
// @access  Public
exports.getLawyers = async (req, res) => {
    try {
        const {
            specialization,
            city,
            minRating,
            maxRate,
            minExperience,
            page = 1,
            limit = 10,
            sortBy = 'rating_average',
            order = 'desc'
        } = req.query;

        // Build Supabase query
        let query = supabase
            .from('lawyers')
            .select('*, user:users(name, email, avatar)')
            .eq('is_verified', true);

        if (specialization) {
            query = query.contains('specializations', [specialization]);
        }

        if (city) {
            query = query.ilike('location_city', `%${city}%`);
        }

        if (minRating) {
            query = query.gte('rating_average', parseFloat(minRating));
        }

        if (maxRate) {
            query = query.lte('hourly_rate', parseFloat(maxRate));
        }

        if (minExperience) {
            query = query.gte('experience', parseInt(minExperience));
        }

        const from = (parseInt(page) - 1) * parseInt(limit);
        const to = from + parseInt(limit) - 1;

        const { data: dbLawyers, error, count } = await query
            .order(sortBy, { ascending: order === 'asc' })
            .range(from, to);

        if (error) throw error;

        // External Geoapify search if lat/lng present
        let { lat, lng, radius = 50 } = req.query;
        let geoapifyResults = [];

        if (lat && lng) {
            try {
                geoapifyResults = await geoapifyMapsService.findLawyersNearby(lat, lng, parseFloat(radius) * 1000);
            } catch (err) {
                console.error('Geoapify fetch failed:', err);
            }
        }

        let allLawyers = dbLawyers || [];
        if (parseInt(page) === 1) {
            allLawyers = [...allLawyers, ...geoapifyResults];
        }

        const combinedTotal = (count || 0) + geoapifyResults.length;

        res.status(200).json({
            success: true,
            count: allLawyers.length,
            total: combinedTotal,
            totalPages: Math.ceil(combinedTotal / parseInt(limit)),
            currentPage: parseInt(page),
            data: allLawyers
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get single lawyer
// @route   GET /api/lawyers/:id
// @access  Public
exports.getLawyer = async (req, res) => {
    try {
        const { data: lawyer, error } = await supabase
            .from('lawyers')
            .select('*, user:users(name, email, avatar, phone)')
            .eq('id', req.params.id)
            .single();

        if (!lawyer || error) {
            return res.status(404).json({ success: false, message: 'Lawyer not found' });
        }

        // Get reviews
        const { data: reviews } = await supabase
            .from('reviews')
            .select('*, user:users(name, avatar)')
            .eq('lawyer_id', lawyer.id)
            .order('created_at', { ascending: false })
            .limit(10);

        res.status(200).json({
            success: true,
            data: {
                ...lawyer,
                reviews: reviews || []
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update lawyer profile
// @route   PUT /api/lawyers/profile
// @access  Private (Lawyer only)
exports.updateProfile = async (req, res) => {
    try {
        const updates = {};
        const allowedUpdates = [
            'specializations',
            'bar_number',
            'experience',
            'bio',
            'education',
            'hourly_rate',
            'languages',
            'location_city',
            'location_state',
            'location_address'
        ];

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const { data: lawyer, error } = await supabase
            .from('lawyers')
            .update(updates)
            .eq('user_id', req.user.id)
            .select()
            .single();

        if (error) throw error;

        res.status(200).json({
            success: true,
            data: lawyer
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update lawyer availability
// @route   PUT /api/lawyers/availability
// @access  Private (Lawyer only)
exports.updateAvailability = async (req, res) => {
    try {
        const { data: lawyer, error } = await supabase
            .from('lawyers')
            .update({ availability: req.body.availability })
            .eq('user_id', req.user.id)
            .select('availability')
            .single();

        if (error) throw error;

        res.status(200).json({
            success: true,
            data: lawyer.availability
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get lawyer's own profile
// @route   GET /api/lawyers/me
// @access  Private (Lawyer only)
exports.getMyProfile = async (req, res) => {
    try {
        const { data: lawyer, error } = await supabase
            .from('lawyers')
            .select('*, user:users(name, email, avatar, phone)')
            .eq('user_id', req.user.id)
            .single();

        if (!lawyer || error) {
            return res.status(404).json({ success: false, message: 'Lawyer profile not found' });
        }

        res.status(200).json({
            success: true,
            data: lawyer
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Get specialization options
// @route   GET /api/lawyers/specializations
// @access  Public
exports.getSpecializations = async (req, res) => {
    const specializations = [
        'Corporate Law',
        'Criminal Law',
        'Family Law',
        'Real Estate',
        'Intellectual Property',
        'Tax Law',
        'Employment Law',
        'Immigration Law',
        'Civil Litigation',
        'Contract Law',
        'Banking & Finance',
        'Environmental Law',
        'Other'
    ];

    res.status(200).json({
        success: true,
        data: specializations
    });
};
