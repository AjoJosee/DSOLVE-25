require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now
    }
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// Email transporter setup
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Routes
app.post('/api/newsletter/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if email already exists
        const existingSubscription = await Newsletter.findOne({ email });
        if (existingSubscription) {
            return res.status(400).json({ error: 'Email already subscribed' });
        }

        // Create new subscription
        const subscription = new Newsletter({ email });
        await subscription.save();

        // Send welcome email
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Welcome to EcoEvents Newsletter!',
            html: `
                <h1>Welcome to EcoEvents!</h1>
                <p>Thank you for subscribing to our newsletter. We're excited to share eco-friendly events and tips with you!</p>
                <p>Stay tuned for our next update.</p>
            `
        });

        res.status(201).json({ message: 'Successfully subscribed to newsletter' });
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 