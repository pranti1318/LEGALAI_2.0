import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FileText,
    Search,
    Shield,
    Users,
    CheckCircle,
    ArrowRight,
    Upload,
    Brain,
    MessageSquare,
    Star,
    Zap,
    Lock,
    Quote,
    Check
} from 'lucide-react';
import './Home.css';

const Home = () => {
    const features = [
        {
            icon: <Upload size={32} />,
            title: 'Upload Documents',
            description: 'Upload legal documents in any format - PDF, images, or scanned copies.'
        },
        {
            icon: <Brain size={32} />,
            title: 'AI Analysis',
            description: 'Advanced OCR and NLP extract key clauses, risks, and obligations.'
        },
        {
            icon: <MessageSquare size={32} />,
            title: 'Expert Consultation',
            description: 'Connect with verified lawyers for personalized legal advice.'
        }
    ];

    const benefits = [
        { icon: <Zap size={24} />, text: 'Instant document analysis' },
        { icon: <Lock size={24} />, text: 'Secure & confidential' },
        { icon: <CheckCircle size={24} />, text: 'Verified lawyers only' },
        { icon: <Star size={24} />, text: 'Ratings & reviews' }
    ];

    const stats = [
        { value: '10K+', label: 'Documents Analyzed' },
        { value: '500+', label: 'Verified Lawyers' },
        { value: '98%', label: 'Satisfaction Rate' },
        { value: '24/7', label: 'Support Available' }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-gradient" />
                    <div className="hero-pattern" />
                </div>

                <div className="hero-content">
                    <motion.div
                        className="hero-text"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="hero-badge">
                            <Zap size={16} />
                            AI-Powered Legal Tech
                        </span>

                        <h1>
                            Navigate Legal Complexity with{' '}
                            <span className="text-gradient">Human Insight</span>
                        </h1>

                        <p className="hero-description">
                            Don't just sign. Understand. Our AI-powered platform provides 
                            the clarity you need to move forward with confidence, backed 
                            by a global network of verified legal experts.
                        </p>

                        <div className="hero-cta">
                            <Link to="/analyze" className="btn btn-primary btn-lg">
                                <Upload size={20} />
                                Analyze Document
                            </Link>
                            <Link to="/lawyers" className="btn btn-outline btn-lg">
                                Find a Lawyer
                                <ArrowRight size={20} />
                            </Link>
                        </div>

                        <div className="hero-benefits">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="benefit-item">
                                    {benefit.icon}
                                    <span>{benefit.text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-visual"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="visual-card">
                            <div className="visual-header">
                                <div className="visual-dots">
                                    <span /><span /><span />
                                </div>
                                <span className="visual-title">Document Analysis</span>
                            </div>
                            <div className="visual-content">
                                <div className="analysis-item">
                                    <div className="analysis-icon risk-high">!</div>
                                    <div className="analysis-text">
                                        <strong>Non-Compete Clause</strong>
                                        <span>High risk - 2 year restriction</span>
                                    </div>
                                </div>
                                <div className="analysis-item">
                                    <div className="analysis-icon risk-medium">~</div>
                                    <div className="analysis-text">
                                        <strong>Liability Limitation</strong>
                                        <span>Medium risk - Review recommended</span>
                                    </div>
                                </div>
                                <div className="analysis-item">
                                    <div className="analysis-icon risk-low">✓</div>
                                    <div className="analysis-text">
                                        <strong>Termination Terms</strong>
                                        <span>Low risk - Standard clause</span>
                                    </div>
                                </div>
                                <div className="risk-score">
                                    <div className="score-label">Overall Risk Score</div>
                                    <div className="score-bar">
                                        <div className="score-fill" style={{ width: '45%' }} />
                                    </div>
                                    <div className="score-value">45/100</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="stat-item"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trusted By Section */}
            <section className="trusted-by">
                <div className="container">
                    <p className="trusted-label">Trusted by innovative legal firms and 10,000+ individuals</p>
                    <div className="logo-grid">
                        <div className="logo-item">LEXINGTON</div>
                        <div className="logo-item">JUSTICE CO.</div>
                        <div className="logo-item">GLOBAL LAW</div>
                        <div className="logo-item">PRIME LEGAL</div>
                        <div className="logo-item">MODERN ADVOCATES</div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Clarity in Three Simple Steps</h2>
                        <p>We’ve simplified the complex world of legal documentation.</p>
                    </motion.div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="feature-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <div className="feature-number">{index + 1}</div>
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials">
                <div className="container">
                    <motion.div
                        className="section-header"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Real Stories from Our Community</h2>
                        <p>Join thousands who have found peace of mind with LegalAI.</p>
                    </motion.div>

                    <div className="testimonials-grid">
                        <motion.div 
                            className="testimonial-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Quote className="quote-icon" size={32} />
                            <p className="testimonial-text">
                                "LegalAI saved me from a predatory employment contract. The AI flagged a non-compete clause I would have otherwise missed. Truly life-changing."
                            </p>
                            <div className="testimonial-author">
                                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100" alt="Sarah J." />
                                <div>
                                    <strong>Sarah Jenkins</strong>
                                    <span>Software Engineer</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="testimonial-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <Quote className="quote-icon" size={32} />
                            <p className="testimonial-text">
                                "As a small business owner, legal fees were always a barrier. LegalAI gives me the confidence to review basic contracts before heading to my lawyer."
                            </p>
                            <div className="testimonial-author">
                                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100" alt="David M." />
                                <div>
                                    <strong>David Miller</strong>
                                    <span>Business Owner</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="testimonial-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Quote className="quote-icon" size={32} />
                            <p className="testimonial-text">
                                "The speed is incredible. I uploaded my rental agreement and had a full risk report in under 30 seconds. Highly recommend."
                            </p>
                            <div className="testimonial-author">
                                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100" alt="Elena R." />
                                <div>
                                    <strong>Elena Rodriguez</strong>
                                    <span>Freelance Designer</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <motion.div
                        className="cta-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="cta-content">
                            <h2>Navigate Your Future with Confidence</h2>
                            <p>
                                Join the community of people taking control of their legal journey.
                                Start your first analysis today.
                            </p>
                            <div className="cta-buttons">
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Get Started Free
                                </Link>
                                <Link to="/about" className="btn btn-secondary btn-lg">
                                    How it Works
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
