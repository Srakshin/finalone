import { NextResponse } from "next/server";

// Simulated IBM Granite model response
// In a real implementation, you would integrate with the actual IBM model
function callIBMModel(content) {
  // This is a simplified version that mimics the FinAdvisor system prompt behavior
  const systemPrompt = `You are FinAdvisor, a professional, trustworthy, and plain-language financial advisor assistant. Your role is to help users understand and make decisions about personal and small-business finance topics including banking, budgeting, savings, investments (general information only), loans and mortgages, insurance and policies, taxes (general explanations), retirement planning, debt management, and related financial tasks.

Always follow these rules:
1. CLARIFY before PERSONALIZING: For any recommendation that depends on personal circumstances, first ask for the user's jurisdiction (country, state/province if relevant), financial goal, time horizon, risk tolerance (low/medium/high), rough income or assets ranges, and any major constraints or preferences.
2. TRANSPARENCY: When you give recommendations or numbers, always show (a) the assumptions you used, (b) step-by-step calculations or formulas (when applicable), and (c) a brief plain-English summary of the conclusion.
3. SCOPE & LIMITS: Do not present yourself as a licensed financial planner, tax advisor, or attorney.
4. SAFETY & LEGALITY: Refuse requests that facilitate fraud, money laundering, tax evasion, or other illegal activities.
5. FORMAT: Present answers with a short summary, clear recommendation, supporting details, and next steps.
6. Be professional, concise, non-judgmental, and helpful.`;

  // Simple pattern matching for common financial queries
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('budget') || lowerContent.includes('budgeting')) {
    return "To create an effective budget, I recommend the 50/30/20 rule: 50% for needs (rent, utilities, groceries), 30% for wants (entertainment, dining out), and 20% for savings and debt repayment. Would you like me to help you calculate this based on your income? I'll need to know your monthly after-tax income and your location for more personalized advice.";
  }
  
  if (lowerContent.includes('save') || lowerContent.includes('saving') || lowerContent.includes('emergency fund')) {
    return "Great question about savings! I recommend starting with an emergency fund of 3-6 months of expenses. Here's a simple approach: 1) Calculate your monthly essential expenses, 2) Multiply by 3-6 months, 3) Start with a goal of $1,000 if the full amount seems overwhelming. To provide more specific guidance, could you share your approximate monthly expenses and any existing savings?";
  }
  
  if (lowerContent.includes('invest') || lowerContent.includes('investment') || lowerContent.includes('stock')) {
    return "Investment advice depends heavily on your personal situation. Generally, consider: 1) Pay off high-interest debt first (>6-7% interest), 2) Build emergency fund, 3) Consider low-cost index funds for long-term growth. **Important**: This is general information and not personalized investment advice. Could you share your age, risk tolerance (low/medium/high), and investment timeline to provide better guidance?";
  }
  
  if (lowerContent.includes('debt') || lowerContent.includes('loan') || lowerContent.includes('credit card')) {
    return "For debt management, I recommend the debt avalanche method: pay minimums on all debts, then put extra money toward the highest interest rate debt first. Alternatively, the debt snowball (smallest balance first) can provide psychological wins. To give you a specific payoff plan, I'd need to know: your debts (amounts and interest rates), minimum payments, and how much extra you can put toward debt monthly.";
  }
  
  if (lowerContent.includes('retirement') || lowerContent.includes('401k') || lowerContent.includes('ira')) {
    return "Retirement planning is crucial! Key steps: 1) Contribute enough to get any employer 401(k) match (free money!), 2) Consider a Roth IRA if eligible, 3) Aim to save 10-15% of income for retirement. The earlier you start, the more compound interest works for you. For personalized calculations, I'd need your age, current retirement savings, income, and retirement goals. What's your current situation?";
  }
  
  if (lowerContent.includes('tax') || lowerContent.includes('taxes')) {
    return "Tax strategies vary significantly by jurisdiction and income level. General tips include: maximizing tax-advantaged accounts (401k, IRA), keeping organized records, and understanding deductions you qualify for. **Important**: This is general information only - tax laws are complex and location-specific. I recommend consulting a qualified tax professional for your specific situation. What country/state are you in, and what specific tax question do you have?";
  }
  
  // Default response for other queries
  return `Thank you for your financial question! To provide the most helpful and accurate advice, I need to understand your specific situation better. Could you please share:

1. Your general location (country, state if relevant)
2. What specific financial goal you're working toward
3. Your time horizon for this goal
4. Your risk tolerance (low, medium, or high)

This will help me give you more personalized guidance while staying within my role as a general financial information assistant. Remember, this is educational information and not licensed financial advice.`;
}

export async function POST(request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Simulate processing time (remove in production with real model)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const response = callIBMModel(message);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}