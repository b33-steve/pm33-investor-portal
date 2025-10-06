/**
 * PM33 Financial Model - Automated Setup Script
 *
 * INSTRUCTIONS:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1uWbsj6hDtKiNeYNAVCwDksnu2ogDTnGcBd7oDxCRPRU/edit
 * 2. Go to Extensions → Apps Script
 * 3. Delete any existing code
 * 4. Paste this entire script
 * 5. Click the disk icon to save
 * 6. Click "Run" button (select buildFinancialModel function)
 * 7. Authorize the script when prompted
 * 8. Wait 10-15 seconds for completion
 * 9. Return to your sheet - everything will be populated!
 */

function buildFinancialModel() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // Clear existing content and create fresh sheet
  let sheet = ss.getActiveSheet();
  sheet.clear();
  sheet.setName('Financial Model');

  // Set up headers and structure
  setupHeaders(sheet);

  // Add all data
  addAssumptions(sheet);
  addCustomerData(sheet);
  addRevenueData(sheet);
  addCostData(sheet);
  addProfitLoss(sheet);
  addCashFlow(sheet);
  addKeyMetrics(sheet);

  // Add formulas
  addFormulas(sheet);

  // Format the sheet
  formatSheet(sheet);

  // Create charts
  createCharts(sheet);

  // Freeze header rows
  sheet.setFrozenRows(3);
  sheet.setFrozenColumns(2);

  SpreadsheetApp.getUi().alert('✅ Financial Model Complete!\n\nYour 18-month P&L, cash flow, and projections are ready.\n\nScroll down to see charts and key metrics.');
}

function setupHeaders(sheet) {
  // Title and subtitle
  sheet.getRange('A1').setValue('PM33 Financial Projections - 18 Month Model');
  sheet.getRange('A2').setValue('All figures in USD - Base Case Scenario (Conservative)');

  // Month headers
  const months = ['Month 0', 'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6',
                  'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12',
                  'Month 13', 'Month 14', 'Month 15', 'Month 16', 'Month 17', 'Month 18'];

  const dates = ['Oct-24', 'Nov-24', 'Dec-24', 'Jan-25', 'Feb-25', 'Mar-25', 'Apr-25',
                 'May-25', 'Jun-25', 'Jul-25', 'Aug-25', 'Sep-25', 'Oct-25',
                 'Nov-25', 'Dec-25', 'Jan-26', 'Feb-26', 'Mar-26', 'Apr-26'];

  sheet.getRange(3, 3, 1, 19).setValues([months]);
  sheet.getRange(4, 3, 1, 19).setValues([dates]);
}

function addAssumptions(sheet) {
  const row = 6;
  sheet.getRange(row, 1).setValue('ASSUMPTIONS & DRIVERS').setFontWeight('bold').setFontSize(12);
  sheet.getRange(row + 1, 1).setValue('Starting Date');
}

function addCustomerData(sheet) {
  const startRow = 9;

  // Section header
  sheet.getRange(startRow, 1).setValue('CUSTOMER ACQUISITION').setFontWeight('bold').setFontSize(12);

  // New customers by tier
  const newCustomers = [
    ['New Customers - Starter ($29)', 0, 40, 50, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220],
    ['New Customers - Team ($99)', 0, 15, 20, 35, 45, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190],
    ['New Customers - Scale ($199)', 0, 4, 8, 12, 18, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76],
    ['New Customers - Enterprise ($399)', 0, 1, 2, 3, 7, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36]
  ];

  for (let i = 0; i < newCustomers.length; i++) {
    sheet.getRange(startRow + 1 + i, 1).setValue(newCustomers[i][0]);
    sheet.getRange(startRow + 1 + i, 3, 1, 19).setValues([newCustomers[i].slice(1)]);
  }

  // Total new customers (will add formula later)
  sheet.getRange(startRow + 5, 1).setValue('Total New Customers').setFontWeight('bold');

  // Cumulative customers
  sheet.getRange(startRow + 7, 1).setValue('Cumulative Customers - Starter');
  sheet.getRange(startRow + 8, 1).setValue('Cumulative Customers - Team');
  sheet.getRange(startRow + 9, 1).setValue('Cumulative Customers - Scale');
  sheet.getRange(startRow + 10, 1).setValue('Cumulative Customers - Enterprise');
  sheet.getRange(startRow + 11, 1).setValue('Total Cumulative Customers').setFontWeight('bold');

  // Churn
  sheet.getRange(startRow + 13, 1).setValue('Monthly Churn Rate');
  const churnRates = [0, 0, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02, 0.02];
  sheet.getRange(startRow + 13, 3, 1, 19).setValues([churnRates]).setNumberFormat('0%');

  sheet.getRange(startRow + 14, 1).setValue('Churned Customers');
}

function addRevenueData(sheet) {
  const startRow = 25;

  sheet.getRange(startRow, 1).setValue('REVENUE MODEL').setFontWeight('bold').setFontSize(12);

  // MRR by tier (formulas will be added)
  sheet.getRange(startRow + 1, 1).setValue('MRR - Starter ($29/month)');
  sheet.getRange(startRow + 2, 1).setValue('MRR - Team ($99/month)');
  sheet.getRange(startRow + 3, 1).setValue('MRR - Scale ($199/month)');
  sheet.getRange(startRow + 4, 1).setValue('MRR - Enterprise ($399/month)');
  sheet.getRange(startRow + 5, 1).setValue('Total MRR').setFontWeight('bold');

  sheet.getRange(startRow + 7, 1).setValue('Annual Recurring Revenue (ARR)').setFontWeight('bold');
}

function addCostData(sheet) {
  const startRow = 34;

  sheet.getRange(startRow, 1).setValue('COSTS - PERSONNEL').setFontWeight('bold').setFontSize(12);

  // Salaries
  const salaries = [
    ['Founders (3 @ $8K/month)', 24000, 24000, 24000, 24000, 24000, 24000, 24000, 24000, 24000, 24000, 24000, 24000, 24000, 24000, 24000, 24000, 24000, 24000, 24000],
    ['Engineering (2-5 @ $10-15K/month)', 20000, 20000, 20000, 25000, 25000, 30000, 30000, 35000, 35000, 40000, 40000, 45000, 45000, 50000, 50000, 55000, 55000, 60000, 60000],
    ['Product/Design (1-2 @ $8-12K/month)', 8000, 8000, 8000, 8000, 12000, 12000, 12000, 16000, 16000, 16000, 20000, 20000, 20000, 24000, 24000, 24000, 28000, 28000, 28000],
    ['Sales/Marketing (0-3 @ $7-10K/month)', 0, 0, 7000, 7000, 7000, 14000, 14000, 14000, 21000, 21000, 21000, 28000, 28000, 28000, 35000, 35000, 35000, 42000, 42000],
    ['Customer Success (0-2 @ $6-8K/month)', 0, 0, 0, 6000, 6000, 6000, 12000, 12000, 12000, 12000, 18000, 18000, 18000, 18000, 24000, 24000, 24000, 24000, 30000],
    ['Operations/Admin (0-1 @ $7K/month)', 0, 0, 0, 0, 7000, 7000, 7000, 7000, 7000, 14000, 14000, 14000, 14000, 14000, 14000, 21000, 21000, 21000, 21000]
  ];

  for (let i = 0; i < salaries.length; i++) {
    sheet.getRange(startRow + 1 + i, 1).setValue(salaries[i][0]);
    sheet.getRange(startRow + 1 + i, 3, 1, 19).setValues([salaries[i].slice(1)]);
  }

  sheet.getRange(startRow + 7, 1).setValue('Total Salaries').setFontWeight('bold');
  sheet.getRange(startRow + 8, 1).setValue('Payroll Taxes & Benefits (25%)');
  sheet.getRange(startRow + 9, 1).setValue('Total Personnel Costs').setFontWeight('bold');

  // Operating expenses
  const opexRow = startRow + 11;
  sheet.getRange(opexRow, 1).setValue('COSTS - OPERATING EXPENSES').setFontWeight('bold').setFontSize(12);

  const opex = [
    ['AI/ML Infrastructure (OpenAI, Pinecone)', 500, 800, 1200, 1800, 2400, 3200, 4000, 4800, 5600, 6400, 7200, 8000, 8800, 9600, 10400, 11200, 12000, 12800, 13600],
    ['AWS/Cloud Hosting', 500, 600, 800, 1000, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200, 4500, 4800, 5100, 5400],
    ['SaaS Tools & Subscriptions', 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200, 3400, 3600, 3800, 4000, 4200, 4400, 4600],
    ['Marketing & Advertising', 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000, 19000, 20000],
    ['Content Creation', 1000, 1500, 1500, 1500, 1500, 1500, 2000, 2000, 2000, 2000, 2500, 2500, 2500, 2500, 3000, 3000, 3000, 3000, 3500],
    ['Events & Community', 500, 500, 1000, 1000, 1000, 1500, 1500, 2000, 2000, 2000, 2500, 2500, 2500, 3000, 3000, 3000, 3500, 3500, 3500],
    ['Office & Overhead', 0, 0, 0, 1000, 1000, 1000, 2000, 2000, 2000, 2000, 3000, 3000, 3000, 3000, 4000, 4000, 4000, 4000, 5000],
    ['Legal & Accounting', 1000, 1000, 1000, 1500, 1500, 2000, 2000, 2000, 2500, 2500, 2500, 3000, 3000, 3000, 3500, 3500, 3500, 4000, 4000]
  ];

  for (let i = 0; i < opex.length; i++) {
    sheet.getRange(opexRow + 1 + i, 1).setValue(opex[i][0]);
    sheet.getRange(opexRow + 1 + i, 3, 1, 19).setValues([opex[i].slice(1)]);
  }

  sheet.getRange(opexRow + 9, 1).setValue('Customer Acquisition Cost (CAC Spend)');
  sheet.getRange(opexRow + 10, 1).setValue('Total Operating Expenses').setFontWeight('bold');

  sheet.getRange(opexRow + 12, 1).setValue('TOTAL COSTS').setFontWeight('bold').setFontSize(12);
}

function addProfitLoss(sheet) {
  const startRow = 59;

  sheet.getRange(startRow, 1).setValue('PROFIT & LOSS').setFontWeight('bold').setFontSize(12);

  sheet.getRange(startRow + 1, 1).setValue('Total Revenue').setFontWeight('bold');
  sheet.getRange(startRow + 2, 1).setValue('Total Costs').setFontWeight('bold');
  sheet.getRange(startRow + 3, 1).setValue('EBITDA').setFontWeight('bold');
  sheet.getRange(startRow + 4, 1).setValue('EBITDA Margin').setFontWeight('bold');
  sheet.getRange(startRow + 6, 1).setValue('Gross Margin (68%)');
  sheet.getRange(startRow + 7, 1).setValue('Operating Margin');
}

function addCashFlow(sheet) {
  const startRow = 68;

  sheet.getRange(startRow, 1).setValue('CASH FLOW').setFontWeight('bold').setFontSize(12);

  sheet.getRange(startRow + 1, 1).setValue('Starting Cash Balance');
  sheet.getRange(startRow + 2, 1).setValue('Cash In - Revenue');
  sheet.getRange(startRow + 3, 1).setValue('Cash In - Fundraising');
  sheet.getRange(startRow + 4, 1).setValue('Total Cash In').setFontWeight('bold');
  sheet.getRange(startRow + 5, 1).setValue('Cash Out - Operating Expenses');
  sheet.getRange(startRow + 6, 1).setValue('Total Cash Out').setFontWeight('bold');
  sheet.getRange(startRow + 7, 1).setValue('Net Cash Flow').setFontWeight('bold');
  sheet.getRange(startRow + 8, 1).setValue('Ending Cash Balance').setFontWeight('bold');
  sheet.getRange(startRow + 9, 1).setValue('Months of Runway Remaining');

  // Initial values
  sheet.getRange(startRow + 1, 3).setValue(1500000); // Starting cash
  sheet.getRange(startRow + 3, 3).setValue(1500000); // Initial fundraising
}

function addKeyMetrics(sheet) {
  const startRow = 79;

  sheet.getRange(startRow, 1).setValue('KEY METRICS').setFontWeight('bold').setFontSize(12);

  sheet.getRange(startRow + 1, 1).setValue('Customer Acquisition Cost (CAC)');
  sheet.getRange(startRow + 2, 1).setValue('Lifetime Value (LTV)');
  sheet.getRange(startRow + 3, 1).setValue('LTV:CAC Ratio');
  sheet.getRange(startRow + 4, 1).setValue('Payback Period (months)');
  sheet.getRange(startRow + 5, 1).setValue('Net Revenue Retention');
  sheet.getRange(startRow + 6, 1).setValue('Average Revenue Per Account (ARPA)');

  sheet.getRange(startRow + 8, 1).setValue('HEADCOUNT').setFontWeight('bold').setFontSize(12);
  sheet.getRange(startRow + 9, 1).setValue('Total Employees');

  // Fixed values
  const cac = Array(19).fill(284);
  const ltv = Array(19).fill(1602);
  const payback = Array(19).fill(5.2);
  const nrr = [1.00, 1.00, 1.00, 1.00, 1.00, 1.05, 1.10, 1.15, 1.20, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25, 1.25];

  sheet.getRange(startRow + 1, 3, 1, 19).setValues([cac]);
  sheet.getRange(startRow + 2, 3, 1, 19).setValues([ltv]);
  sheet.getRange(startRow + 4, 3, 1, 19).setValues([payback]);
  sheet.getRange(startRow + 5, 3, 1, 19).setValues([nrr]).setNumberFormat('0%');
}

function addFormulas(sheet) {
  // Total new customers (row 14)
  for (let col = 3; col <= 21; col++) {
    sheet.getRange(14, col).setFormula(`=SUM(${getColumnLetter(col)}10:${getColumnLetter(col)}13)`);
  }

  // Cumulative customers
  for (let col = 4; col <= 21; col++) {
    const prevCol = getColumnLetter(col - 1);
    const curCol = getColumnLetter(col);

    // Starter
    sheet.getRange(16, col).setFormula(`=${prevCol}16+${curCol}10`);
    // Team
    sheet.getRange(17, col).setFormula(`=${prevCol}17+${curCol}11`);
    // Scale
    sheet.getRange(18, col).setFormula(`=${prevCol}18+${curCol}12`);
    // Enterprise
    sheet.getRange(19, col).setFormula(`=${prevCol}19+${curCol}13`);
  }

  // Total cumulative customers
  for (let col = 3; col <= 21; col++) {
    sheet.getRange(20, col).setFormula(`=SUM(${getColumnLetter(col)}16:${getColumnLetter(col)}19)`);
  }

  // Churned customers
  for (let col = 4; col <= 21; col++) {
    const prevCol = getColumnLetter(col - 1);
    const curCol = getColumnLetter(col);
    sheet.getRange(23, col).setFormula(`=ROUND(${prevCol}20*${curCol}22,0)`);
  }

  // MRR calculations
  for (let col = 3; col <= 21; col++) {
    const c = getColumnLetter(col);
    sheet.getRange(26, col).setFormula(`=${c}16*29`); // Starter MRR
    sheet.getRange(27, col).setFormula(`=${c}17*99`); // Team MRR
    sheet.getRange(28, col).setFormula(`=${c}18*199`); // Scale MRR
    sheet.getRange(29, col).setFormula(`=${c}19*399`); // Enterprise MRR
    sheet.getRange(30, col).setFormula(`=SUM(${c}26:${c}29)`); // Total MRR
    sheet.getRange(32, col).setFormula(`=${c}30*12`); // ARR
  }

  // Personnel costs
  for (let col = 3; col <= 21; col++) {
    const c = getColumnLetter(col);
    sheet.getRange(41, col).setFormula(`=SUM(${c}35:${c}40)`); // Total salaries
    sheet.getRange(42, col).setFormula(`=${c}41*0.25`); // Benefits
    sheet.getRange(43, col).setFormula(`=${c}41+${c}42`); // Total personnel
  }

  // CAC spend
  for (let col = 3; col <= 21; col++) {
    const c = getColumnLetter(col);
    sheet.getRange(53, col).setFormula(`=${c}14*284`); // New customers * CAC
  }

  // Total operating expenses
  for (let col = 3; col <= 21; col++) {
    const c = getColumnLetter(col);
    sheet.getRange(54, col).setFormula(`=SUM(${c}46:${c}53)`);
  }

  // Total costs
  for (let col = 3; col <= 21; col++) {
    const c = getColumnLetter(col);
    sheet.getRange(56, col).setFormula(`=${c}43+${c}54`);
  }

  // P&L
  for (let col = 3; col <= 21; col++) {
    const c = getColumnLetter(col);
    sheet.getRange(60, col).setFormula(`=${c}30`); // Total revenue
    sheet.getRange(61, col).setFormula(`=${c}56`); // Total costs
    sheet.getRange(62, col).setFormula(`=${c}60-${c}61`); // EBITDA
    sheet.getRange(63, col).setFormula(`=IF(${c}60=0,"N/A",${c}62/${c}60)`); // EBITDA margin
    sheet.getRange(65, col).setFormula(`=${c}60*0.68`); // Gross margin
    sheet.getRange(66, col).setFormula(`=${c}63`); // Operating margin
  }

  // Cash flow
  sheet.getRange(69, 4).setFormula('=C76'); // Starting balance M1
  for (let col = 5; col <= 21; col++) {
    const prevCol = getColumnLetter(col - 1);
    sheet.getRange(69, col).setFormula(`=${prevCol}76`); // Starting balance = prev ending
  }

  for (let col = 3; col <= 21; col++) {
    const c = getColumnLetter(col);
    sheet.getRange(70, col).setFormula(`=${c}30`); // Cash in - revenue
    // Fundraising already set manually
    sheet.getRange(72, col).setFormula(`=${c}70+${c}71`); // Total cash in
    sheet.getRange(73, col).setFormula(`=${c}56`); // Cash out
    sheet.getRange(74, col).setFormula(`=${c}73`); // Total cash out
    sheet.getRange(75, col).setFormula(`=${c}72-${c}74`); // Net cash flow
    sheet.getRange(76, col).setFormula(`=${c}69+${c}75`); // Ending balance
    sheet.getRange(77, col).setFormula(`=IF(${c}75>=0,999,${c}76/ABS(${c}75))`); // Runway
  }

  // LTV:CAC ratio
  for (let col = 3; col <= 21; col++) {
    const c = getColumnLetter(col);
    sheet.getRange(82, col).setFormula(`=${c}81/${c}80`);
  }

  // ARPA
  for (let col = 3; col <= 21; col++) {
    const c = getColumnLetter(col);
    sheet.getRange(85, col).setFormula(`=IF(${c}20=0,0,${c}30/${c}20)`);
  }

  // Headcount
  for (let col = 3; col <= 21; col++) {
    const c = getColumnLetter(col);
    sheet.getRange(88, col).setFormula(`=COUNTA(${c}35:${c}40)`);
  }

  // Fundraising months 1-18 = 0
  sheet.getRange(71, 4, 1, 18).setValue(0);
}

function formatSheet(sheet) {
  // Format currency columns
  sheet.getRange('C1:U100').setNumberFormat('$#,##0');

  // Format specific rows as percentages
  sheet.getRange('C22:U22').setNumberFormat('0%'); // Churn rate
  sheet.getRange('C63:U63').setNumberFormat('0.0%'); // EBITDA margin
  sheet.getRange('C66:U66').setNumberFormat('0.0%'); // Operating margin
  sheet.getRange('C84:U84').setNumberFormat('0%'); // NRR

  // Format ratio
  sheet.getRange('C82:U82').setNumberFormat('0.0'); // LTV:CAC

  // Format runway
  sheet.getRange('C77:U77').setNumberFormat('0.0'); // Months runway

  // Bold section headers
  const headers = [1, 9, 25, 34, 45, 59, 68, 79];
  headers.forEach(row => {
    sheet.getRange(row, 1, 1, 2).setFontWeight('bold').setFontSize(12);
  });

  // Conditional formatting - negative cash
  const cashRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberLessThan(0)
    .setBackground('#f4cccc')
    .setRanges([sheet.getRange('C76:U76')])
    .build();

  // Conditional formatting - positive EBITDA
  const ebitdaRule = SpreadsheetApp.newConditionalFormatRule()
    .whenNumberGreaterThan(0)
    .setBackground('#d9ead3')
    .setRanges([sheet.getRange('C62:U62')])
    .build();

  const rules = sheet.getConditionalFormatRules();
  rules.push(cashRule);
  rules.push(ebitdaRule);
  sheet.setConditionalFormatRules(rules);

  // Column widths
  sheet.setColumnWidth(1, 300); // Labels
  sheet.setColumnWidth(2, 100); // Space
  for (let i = 3; i <= 21; i++) {
    sheet.setColumnWidth(i, 90); // Data columns
  }

  // Row heights
  sheet.setRowHeight(1, 30);
  sheet.setRowHeight(2, 25);
}

function createCharts(sheet) {
  // Chart 1: MRR Growth
  const mrrChart = sheet.newChart()
    .setChartType(Charts.ChartType.LINE)
    .addRange(sheet.getRange('C4:U4')) // Month headers
    .addRange(sheet.getRange('C30:U30')) // Total MRR
    .setPosition(91, 1, 0, 0)
    .setOption('title', 'Monthly Recurring Revenue (MRR) - 18 Month Projection')
    .setOption('width', 1000)
    .setOption('height', 400)
    .setOption('hAxis', {title: 'Month'})
    .setOption('vAxis', {title: 'MRR ($)', format: '$#,###'})
    .setOption('legend', {position: 'none'})
    .setOption('colors', ['#0052CC'])
    .build();

  sheet.insertChart(mrrChart);

  // Chart 2: Cash Runway
  const cashChart = sheet.newChart()
    .setChartType(Charts.ChartType.AREA)
    .addRange(sheet.getRange('C4:U4')) // Month headers
    .addRange(sheet.getRange('C76:U76')) // Ending cash balance
    .setPosition(91, 7, 0, 0)
    .setOption('title', 'Cash Runway - 18 Month Projection')
    .setOption('width', 1000)
    .setOption('height', 400)
    .setOption('hAxis', {title: 'Month'})
    .setOption('vAxis', {title: 'Cash Balance ($)', format: '$#,###'})
    .setOption('legend', {position: 'none'})
    .setOption('colors', ['#00A86B'])
    .build();

  sheet.insertChart(cashChart);

  // Chart 3: Customer Growth
  const customerChart = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(sheet.getRange('C4:U4')) // Month headers
    .addRange(sheet.getRange('C20:U20')) // Total customers
    .setPosition(115, 1, 0, 0)
    .setOption('title', 'Total Customer Growth - Cumulative')
    .setOption('width', 1000)
    .setOption('height', 400)
    .setOption('hAxis', {title: 'Month'})
    .setOption('vAxis', {title: 'Total Customers'})
    .setOption('legend', {position: 'none'})
    .setOption('colors', ['#6554C0'])
    .build();

  sheet.insertChart(customerChart);
}

// Helper function to convert column number to letter
function getColumnLetter(column) {
  let temp, letter = '';
  while (column > 0) {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

// Create menu for easy access
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('📊 PM33 Financial Model')
    .addItem('Build/Rebuild Model', 'buildFinancialModel')
    .addToUi();
}
