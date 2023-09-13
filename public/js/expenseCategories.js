const expenseKeywords = {
    "Utilities": [
        "Electricity",
        "Water",
        "Gas",
        "Internet",
        "Cable",
        "Phone"
    ],
    "Transportation": [
        "Fuel",
        "Public Transit",
        "Taxi",
        "Maintenance",
        "Parking",
        "Car"
    ],
    "Housing": [
        "Rent",
        "Mortgage",
        "Taxes",
        "Home",
        "Maintenance",
        "Improvement"
    ],
    "Healthcare": [
        "Health",
        "Doctor",
        "Prescriptions",
        "Dental",
        "Vision",
        "Supplements"
    ],
    "Education": [
        "Tuition",
        "Books",
        "Courses",
        "Loans",
        "Activities"
    ],
    "Entertainment": [
        "Dinner",
        "Movies",
        "Concerts",
        "Hobbies",
        "Subscriptions",
        "Travel"
    ],
    "Shopping": [
        "Clothing",
        "Electronics",
        "Furniture",
        "Gifts",
        "Online",
        "Groceries"
    ],
    "Debt Repayment": [
        "Credit Card",
        "Loan",
        "Loans",
        "Other Debt"
    ],
    "Savings/Investments": [
        "Savings",
        "Investments",
        "Retirement",
        "Brokerage"
    ],
    "Charitable Donations": [
        "Donations",
        "Religious",
        "Fundraising"
    ],
    "Childcare/Child Expenses": [
        "Daycare",
        "Babysitting",
        "School Supplies",
        "Children's Activities"
    ],
};

function categorizeExpense(itemName) {
    for (const category in expenseKeywords) {
        const keywords = expenseKeywords[category];
        for (const keyword of keywords) {
            if (itemName.toLowerCase().includes(keyword.toLowerCase())) {
                return category;
            }
        }
    }

    // If no match is found, return a default category like "Other."
    return "Other";
}