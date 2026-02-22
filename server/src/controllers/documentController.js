const axios = require('axios');
const supabase = require('../config/supabase');
const path = require('path');
const fs = require('fs');

// @desc    Upload document for analysis
// @route   POST /api/documents/upload
// @access  Private
exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a file'
            });
        }

        // Determine file type
        const ext = path.extname(req.file.originalname).toLowerCase();
        let fileType = 'image';
        if (ext === '.pdf') fileType = 'pdf';
        if (['.doc', '.docx'].includes(ext)) fileType = 'doc';

        // Create document record in Supabase
        const { data: document, error } = await supabase
            .from('documents')
            .insert([{
                user_id: req.user.id,
                title: req.file.originalname,
                file_name: req.file.filename,
                file_path: req.file.path,
                file_type: fileType,
                file_size: req.file.size,
                status: 'uploaded'
            }])
            .select()
            .single();

        if (error) throw error;

        res.status(201).json({
            success: true,
            data: document
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error uploading document'
        });
    }
};

// @desc    Analyze uploaded document
// @route   POST /api/documents/:id/analyze
// @access  Private
exports.analyzeDocument = async (req, res) => {
    try {
        const { data: document, error: fetchError } = await supabase
            .from('documents')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Check ownership
        if (document.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to analyze this document'
            });
        }

        // Update status to processing
        await supabase
            .from('documents')
            .update({ status: 'processing' })
            .eq('id', document.id);

        try {
            // Call AI service
            const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';

            // Read file and send to AI service
            const fileBuffer = fs.readFileSync(document.file_path);
            const base64File = fileBuffer.toString('base64');

            const response = await axios.post(`${aiServiceUrl}/analyze`, {
                file: base64File,
                fileName: document.title,
                fileType: document.file_type
            }, {
                timeout: 120000
            });

            // Update document with analysis
            const { data: updatedDoc, error: updateError } = await supabase
                .from('documents')
                .update({
                    analysis: response.data.analysis || {},
                    status: 'analyzed',
                    updated_at: new Date()
                })
                .eq('id', document.id)
                .select()
                .single();

            if (updateError) throw updateError;

            res.status(200).json({
                success: true,
                data: updatedDoc
            });
        } catch (aiError) {
            console.error('AI Service Error:', aiError.message);

            // Return mock analysis for demo purposes
            const mockAnalysis = generateMockAnalysis();
            const { data: mockDoc } = await supabase
                .from('documents')
                .update({
                    analysis: mockAnalysis,
                    status: 'analyzed',
                    updated_at: new Date()
                })
                .eq('id', document.id)
                .select()
                .single();

            res.status(200).json({
                success: true,
                data: mockDoc,
                note: 'Demo analysis provided (AI service offline)'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error analyzing document'
        });
    }
};

// @desc    Get user's documents
// @route   GET /api/documents
// @access  Private
exports.getDocuments = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        let query = supabase
            .from('documents')
            .select('*', { count: 'exact' })
            .eq('user_id', req.user.id);

        if (status) query = query.eq('status', status);

        const from = (parseInt(page) - 1) * parseInt(limit);
        const to = from + parseInt(limit) - 1;

        const { data: documents, error, count } = await query
            .order('created_at', { ascending: false })
            .range(from, to);

        if (error) throw error;

        res.status(200).json({
            success: true,
            count: documents.length,
            total: count,
            totalPages: Math.ceil(count / parseInt(limit)),
            data: documents
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
exports.getDocument = async (req, res) => {
    try {
        const { data: document, error } = await supabase
            .from('documents')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (error || !document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Check ownership (unless admin)
        if (document.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this document'
            });
        }

        res.status(200).json({
            success: true,
            data: document
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = async (req, res) => {
    try {
        const { data: document, error: fetchError } = await supabase
            .from('documents')
            .select('*')
            .eq('id', req.params.id)
            .single();

        if (fetchError || !document) {
            return res.status(404).json({
                success: false,
                message: 'Document not found'
            });
        }

        // Check ownership
        if (document.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this document'
            });
        }

        // Delete file from storage
        if (fs.existsSync(document.file_path)) {
            fs.unlinkSync(document.file_path);
        }

        const { error: deleteError } = await supabase
            .from('documents')
            .delete()
            .eq('id', document.id);

        if (deleteError) throw deleteError;

        res.status(200).json({
            success: true,
            message: 'Document deleted'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Mock analysis generator for demo
function generateMockAnalysis() {
    return {
        summary: 'This appears to be a legal agreement between two parties outlining terms and conditions for services or property transfer.',
        documentType: 'Service Agreement',
        clauses: [
            {
                type: 'Liability Limitation',
                content: 'The service provider shall not be liable for indirect or consequential damages.',
                riskLevel: 'medium',
                explanation: 'This clause limits what you can claim if something goes wrong.'
            },
            {
                type: 'Termination',
                content: 'Either party may terminate with 30 days written notice.',
                riskLevel: 'low',
                explanation: 'Standard termination clause with reasonable notice period.'
            },
            {
                type: 'Non-Compete',
                content: 'The recipient agrees not to engage in competing business for 2 years.',
                riskLevel: 'high',
                explanation: 'This restricts your ability to work in similar fields. Consider negotiating.'
            }
        ],
        keyTerms: [
            { term: 'Effective Date', definition: 'The date when this agreement becomes active' },
            { term: 'Parties', definition: 'The individuals or entities entering into this agreement' }
        ],
        parties: [
            { role: 'Service Provider', name: 'Party A' },
            { role: 'Client', name: 'Party B' }
        ],
        dates: {
            effective: new Date(),
            expiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        },
        obligations: [
            { party: 'Service Provider', description: 'Deliver services as specified', deadline: '30 days' },
            { party: 'Client', description: 'Make payment upon completion', deadline: '15 days after delivery' }
        ],
        penalties: [
            { condition: 'Late payment', consequence: 'Interest of 1.5% per month', severity: 'medium' },
            { condition: 'Early termination', consequence: 'Penalty of 2 months fees', severity: 'high' }
        ],
        overallRiskScore: 45,
        recommendations: [
            'Review the non-compete clause carefully before signing',
            'Consider negotiating the liability limitation',
            'Ensure all deliverables are clearly defined'
        ]
    };
}
