import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Brain,
    Scale,
    Shield,
    Zap,
    Users,
    Target,
    Award,
    Sparkles,
    CheckCircle,
    ArrowRight,
    Cpu,
    Lock,
    TrendingUp,
    Globe,
    Heart,
    Lightbulb,
    Mail,
    Plus,
    Minus,
    Twitter,
    Linkedin,
    Eye,
    Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

    const features = [
        {
            icon: <Brain size={32} />,
            title: 'Neural Legal Analysis',
            description: 'Our proprietary models perform deep semantic analysis of clauses, identifying hidden risks and missing protections with surgical precision.',
            color: '#818cf8'
        },
        {
            icon: <Shield size={32} />,
            title: 'Fortress-Grade Security',
            description: 'Documents are encrypted at rest and in transit with bank-level AES-256 protocols. Your data never leaves our secure perimeter.',
            color: '#34d399'
        },
        {
            icon: <Zap size={32} />,
            title: 'Instant Intelligence',
            description: 'Skip the 48-hour wait for a paralegal review. Get a comprehensive risk profile and summary in under 30 seconds.',
            color: '#fbbf24'
        },
        {
            icon: <Users size={32} />,
            title: 'Human-in-the-Loop',
            description: 'AI handles the heavy lifting, while our network of elite legal professionals is available for complex strategic consultation.',
            color: '#f472b6'
        }
    ];

    const stats = [
        { value: '50,000+', label: 'Analyses Run', icon: <Scale size={24} /> },
        { value: '1,200+', label: 'Verified Partners', icon: <Users size={24} /> },
        { value: '99.2%', label: 'Extraction Accuracy', icon: <Target size={24} /> },
        { value: '24/7', label: 'Uptime Reliability', icon: <Zap size={24} /> }
    ];

    const values = [
        {
            icon: <Lightbulb size={28} />,
            title: 'Radical Transparency',
            description: 'We believe knowledge is power. We expose the fine print that companies rely on you to ignore.'
        },
        {
            icon: <Eye size={28} />,
            title: 'Clarity Over Complexity',
            description: 'Lawyers are paid to be complex. We are paid to make things simple and actionable for you.'
        },
        {
            icon: <Lock size={28} />,
            title: 'Privacy First',
            description: 'You are not the product. Your documents are never used for training or sold to third parties.'
        },
        {
            icon: <TrendingUp size={28} />,
            title: 'Standardizing Justice',
            description: 'Providing everyone with the same legal firepower previously reserved for large corporations.'
        }
    ];

    const team = [
        {
            name: 'Dr. Vikram Sethi',
            role: 'CEO & Founder',
            bio: 'A visionary jurist with 20 years at the Supreme Court. Expert in bridging the gap between traditional law and digital frontiers.',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400&h=400',
            socials: { twitter: '#', linkedin: '#' }
        },
        {
            name: 'Ananya Iyer',
            role: 'Head of AI Research',
            bio: 'Leading NLP researcher formerly at Stanford. Specializes in multi-jurisdictional legal semantics and zero-shot reasoning.',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400',
            socials: { twitter: '#', linkedin: '#' }
        },
        {
            name: 'Arjun Mehra',
            role: 'CTO',
            bio: 'Ex-Google Cloud architect. Built the secure, high-latency systems that power our real-time legal analysis engine.',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400&h=400',
            socials: { twitter: '#', linkedin: '#' }
        },
        {
            name: 'Meera Deshmukh',
            role: 'General Counsel',
            bio: 'Former partner at a top-tier firm. Ensures our AI maintains the highest standards of legal ethics and compliance.',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400&h=400',
            socials: { twitter: '#', linkedin: '#' }
        }
    ];

    const timeline = [
        {
            year: '2023',
            title: 'The Blueprint',
            description: 'LegalAI founded with the goal of ending the "Complexity Penalty" in legal documents.'
        },
        {
            year: '2024',
            title: 'Neural Engine V1',
            description: 'Alpha release of our OCR-NLP pipeline. First 5,000 documents successfully analyzed with 90%+ accuracy.'
        },
        {
            year: '2025',
            title: 'The Legal Network',
            description: 'Launched a nationwide network of 1,000+ top-tier verified lawyers to provide a human layer to AI insights.'
        },
        {
            year: '2026',
            title: 'Contextual Reasoning',
            description: 'Integration of deep contextual reasoning models (GPT-4o) and expansion into multi-country compliance.'
        }
    ];

    const faqs = [
        {
            question: "How does LegalAI compare to a human lawyer?",
            answer: "LegalAI is a powerful first-look tool. It identifies 95% of standard risks in seconds. While it doesn't replace the strategic advice of a lawyer, it prepares you to have a much more informed and cost-effective conversation with one."
        },
        {
            question: "Is my data used to train the global model?",
            answer: "Absolutely not. We use 'Isolated Instance' processing. Your document is processed in a temporary secure container and deleted immediately after analysis, unless you explicitly choose to save it to your encrypted vault."
        },
        {
            question: "What jurisdiction-specific laws do you support?",
            answer: "We are heavily optimized for Indian, UK, and US common law. Our models understand the nuances of the Companies Act, RERA, and standard employment headers across these regions."
        }
    ];

    const [activeFaq, setActiveFaq] = React.useState(0);

    return (
        <div className="about-page">
            {/* Parallax Hero */}
            <section className="about-hero">
                <motion.div className="hero-bg-visual" style={{ scale }}>
                    <div className="orb orb-1"></div>
                    <div className="orb orb-2"></div>
                </motion.div>

                <div className="about-container">
                    <motion.div
                        className="hero-content"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                    >
                        <motion.div
                            className="hero-badge"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Sparkles size={16} />
                            <span>The Future of Law is Here</span>
                        </motion.div>

                        <h1 className="hero-title">
                            Leveling the <span className="gradient-text">Legal Playing Field</span>
                        </h1>

                        <p className="hero-description">
                            LegalAI was built on a simple premise: Everyone deserves to understand
                            what they sign. We use elite artificial intelligence to translate
                            "lawyer-speak" into clear, actionable intelligence.
                        </p>

                        <div className="hero-actions">
                            <Link to="/register" className="btn btn-primary btn-lg">Join the Revolution</Link>
                            <a href="#vision" className="btn btn-outline btn-lg">Our Vision</a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="impact-stats">
                <div className="about-container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                className="stat-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="stat-icon-wrapper">{stat.icon}</div>
                                <div className="stat-info">
                                    <h3>{stat.value}</h3>
                                    <p>{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why We Exist */}
            <section id="vision" className="vision-section">
                <div className="about-container">
                    <div className="vision-layout">
                        <motion.div
                            className="vision-text"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="section-label">Our Philosophy</span>
                            <h2>Why We Exist</h2>
                            <p>
                                For decades, the legal industry has thrived on opacity. Multi-page contracts
                                are designed to be scanned, not read. This "Complexity Penalty"
                                disproportionately harms individuals and small businesses.
                            </p>
                            <p>
                                <strong>LegalAI is the antidote.</strong> We've built a system that treats
                                legal documents as data, allowing us to find patterns, risks, and
                                opportunities that even the most seasoned lawyers might miss during
                                a manual review.
                            </p>
                            <div className="vision-quote">
                                <Star size={24} className="star-icon" />
                                <blockquote>"Truth shouldn't be hidden behind a paywall of billable hours."</blockquote>
                            </div>
                        </motion.div>
                        <motion.div
                            className="vision-visual"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                        >
                            <div className="visual-box">
                                <div className="glow-effect"></div>
                                <img src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800" alt="Legal Vision" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Tech */}
            <section className="features-section">
                <div className="about-container">
                    <div className="section-header">
                        <h2>The Core Intelligence</h2>
                        <p>We've spent thousands of hours training our models on real-world case law and contract structures.</p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="feature-card"
                                whileHover={{ y: -12 }}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="feature-icon" style={{ backgroundColor: `${feature.color}20`, color: feature.color }}>
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="values-section">
                <div className="about-container">
                    <div className="section-header">
                        <h2>Our DNA</h2>
                        <p>The principles that ensure we stay on the side of the user, always.</p>
                    </div>

                    <div className="values-grid">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                className="value-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="value-icon">{value.icon}</div>
                                <h3>{value.title}</h3>
                                <p>{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="team-section">
                <div className="about-container">
                    <div className="section-header">
                        <h2>The Visionaries</h2>
                        <p>Meet the blend of legal masterminds and engineering veterans building LegalAI.</p>
                    </div>

                    <div className="team-grid">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                className="team-card"
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="team-img-wrapper">
                                    <img src={member.image} alt={member.name} />
                                    <div className="team-social">
                                        <a href="#"><Linkedin size={20} /></a>
                                        <a href="#"><Twitter size={20} /></a>
                                    </div>
                                </div>
                                <div className="team-info">
                                    <h3>{member.name}</h3>
                                    <span>{member.role}</span>
                                    <p>{member.bio}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="about-cta">
                <div className="about-container">
                    <motion.div
                        className="cta-glass-card"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="cta-content">
                            <Award size={48} className="award-icon" />
                            <h2>Ready for Clarity?</h2>
                            <p>Don't sign another document until you've seen the LegalAI report.</p>
                            <div className="cta-btns">
                                <Link to="/analyze" className="btn btn-primary btn-lg">Start Free Analysis</Link>
                                <Link to="/lawyers" className="btn btn-outline btn-lg">Talk to a Pro</Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default About;
