const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const compression = require('compression');
const cors = require('cors');
const app = express();
const Expense = require('./models/expense');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const session = require('express-session');
const User = require('./models/user');
const path = require('path');
const port = process.env.PORT || 3000;


app.use(cors());
app.use(compression());
app.use(bodyParser.json());

app.use(session({ secret: '1b0a2826717acc2113bb86e589109aa919aa5c59', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/dashboard', express.static('dashboard'));

passport.use(new GitHubStrategy({
    clientID: '2f57ce73062e051b78b6',
    clientSecret: '1b0a2826717acc2113bb86e589109aa919aa5c59',
    callbackURL: 'http://18.117.113.195:3000/auth/github/callback'
}, async (accessToken, refreshToken, profile, done) => {
    const githubId = profile.id;

    try {
        let user = await User.findOne({ githubId });
        console.log(githubId);

        if (!user) {
            user = new User({ githubId });
            await user.save();
        }
        
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


app.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        console.log('User is authenticated')
        res.redirect('/dashboard');
    } else {
        res.redirect('/auth/github');
    }
});

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/auth' }),
    (req, res) => {
        res.redirect('/');
    }
);

app.use(express.static('public'));

/*
const corsOptions = {
    origin: 'http://localhost:3000',
  };

app.get('/logout', cors(corsOptions), (req, res) => {
    if (req.isAuthenticated()) {
        req.logout((err) => {
            if (err) {
                console.error('Error while logging out:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            console.log('User logged out');
        });
    } else {
        console.log('User is not authenticated');
    }
});
*/


app.get('/user-info', (req, res) => {
    if (req.isAuthenticated()) {
        console.log('User is authenticated 1')
        const githubId = req.user.githubId;
        res.json({ githubId });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        console.log('User is authenticated 2')
        return next();
    } else {
        res.redirect('/auth/github');
    }
}

app.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const dbURI = 'mongodb+srv://alocnayr:C55HXoL5LxElyQcl@expensedb.kri1wvn.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => console.error('Error connecting to MongoDB:', err));


    app.post('/add', async (req, res) => {
        try {
            const { name, amount, category } = req.body;
            const githubId = req.user.githubId;
            const existingExpense = await Expense.findOne({ githubId, name });
            if (existingExpense) {
                return res.status(400).json({ error: 'Expense with the same name already exists' });
            }
    
            const expense = new Expense({ githubId, name, amount, category });
            await expense.save();
            const expenses = await Expense.find({ githubId });
            const remainingBudget = calculateRemainingBudget(expenses);
            res.status(200).json({ expenses, remainingBudget });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    

app.post('/update', async (req, res) => {
    try {
        const { ...updatedExpenseData } = req.body;
        const { oldName, ...updateData } = updatedExpenseData;
        const githubId = req.user.githubId;
        const expense = await Expense.findOne({ githubId, name: oldName });
        if(!expense) {
            res.status(400).json({ error: 'Expense not found' });
            return;
        }
        else{
            expense.name = updateData.name;
            expense.amount = updateData.amount;
            expense.category = updateData.category;
            await expense.save();
        }
        const expenses = await Expense.find({ githubId});
        const remainingBudget = calculateRemainingBudget(expenses);
        res.status(200).json({ expenses, remainingBudget });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/delete', async (req, res) => {
    try {
        const { name } = req.body;
        const githubId = req.user.githubId;
        await Expense.deleteOne({ githubId, name });
        const expenses = await Expense.find({ githubId});
        const remainingBudget = calculateRemainingBudget(expenses);
        res.status(200).json({ expenses, remainingBudget });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/fetch', async (req, res) => {
    try {
        const githubId = req.user.githubId;
        const expenses = await Expense.find({ githubId});
        const remainingBudget = calculateRemainingBudget(expenses);
        res.status(200).json({ expenses, remainingBudget });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/getExpense', async (req, res) => {
    try {
        const { name } = req.body;
        const githubId = req.user.githubId;
        const expense = await Expense.findOne({ githubId, name });
        res.status(200).json(expense);
    }
    catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const calculateRemainingBudget = (expenses, initialBudget = 500) => {
    const totalExpenseAmount = expenses.reduce((total, expense) => total + expense.amount, 0);
    return initialBudget - totalExpenseAmount;
};