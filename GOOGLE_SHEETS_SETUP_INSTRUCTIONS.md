# Google Sheets Financial Model - Setup Instructions

## Quick Start (5 minutes)

### Step 1: Import the CSV
1. Go to Google Sheets: https://sheets.google.com
2. Click **File → Import**
3. Upload `PM33_Financial_Model.csv`
4. Import location: **Replace spreadsheet**
5. Separator type: **Comma**
6. Click **Import data**

### Step 2: Format the Sheet

#### A. Freeze Header Rows
1. Click on row 3 (the month headers)
2. **View → Freeze → Up to row 3**

#### B. Format Currency Cells
1. Select all numeric cells (columns D onwards, from row 4 down)
2. **Format → Number → Currency** (or use toolbar `$` button)

#### C. Format Percentage Cells
Select these specific rows and format as percentage:
- Row 24 (Monthly Churn Rate)
- Row 47 (EBITDA Margin)
- Row 50 (Operating Margin)
- Row 66 (Net Revenue Retention)

### Step 3: Add Key Formulas

Since CSV can't contain formulas, you need to add these manually. Copy-paste these formulas into the specified cells:

#### REVENUE CALCULATIONS

**Cell C26 (Total MRR):**
```
=C22+C23+C24+C25
```
Then drag right across to column U (Month 18).

**Cell C28 (ARR):**
```
=C26*12
```
Drag right to column U.

#### COST CALCULATIONS

**Cell C37 (Total Salaries):**
```
=SUM(C31:C36)
```
Drag right to column U.

**Cell C38 (Payroll Taxes & Benefits):**
```
=C37*0.25
```
Drag right to column U.

**Cell C39 (Total Personnel Costs):**
```
=C37+C38
```
Drag right to column U.

**Cell C47 (Total Operating Expenses):**
```
=SUM(C41:C46)+C50
```
Note: C50 is CAC which is calculated separately. Drag right to column U.

**Cell C49 (TOTAL COSTS):**
```
=C39+C47
```
Drag right to column U.

#### P&L CALCULATIONS

**Cell C53 (Total Revenue):**
```
=C26
```
(Links to Total MRR). Drag right to column U.

**Cell C54 (Total Costs):**
```
=C49
```
Drag right to column U.

**Cell C55 (EBITDA):**
```
=C53-C54
```
Drag right to column U.

**Cell C56 (EBITDA Margin):**
```
=IF(C53=0,"N/A",C55/C53)
```
Drag right to column U. Format as percentage.

**Cell C58 (Gross Margin @ 68%):**
```
=C53*0.68
```
Drag right to column U.

**Cell C59 (Operating Margin):**
```
=C56
```
(Same as EBITDA Margin for this model). Drag right to column U.

#### CASH FLOW CALCULATIONS

**Cell C63 (Starting Cash Balance):**
- Cell C63 = `1500000` (initial funding)
- Cell D63 = `=C67` (previous month's ending balance)
- Drag D63 right to column U

**Cell C65 (Cash In - Fundraising):**
- C65 = `1500000`
- D65 onwards = `0`

**Cell C66 (Total Cash In):**
```
=C64+C65
```
Drag right to column U.

**Cell C68 (Total Cash Out):**
```
=C49
```
(Links to Total Costs). Drag right to column U.

**Cell C69 (Net Cash Flow):**
```
=C66-C68
```
Drag right to column U.

**Cell C70 (Ending Cash Balance):**
```
=C63+C69
```
Drag right to column U.

**Cell C71 (Months of Runway):**
```
=IF(C69>=0,999,C70/ABS(C69))
```
Drag right to column U. This shows how many months of cash remain at current burn rate.

#### KEY METRICS CALCULATIONS

**Cell C75 (CAC - stays constant at $284):**
Already filled in CSV as 284.

**Cell C76 (LTV - stays constant at $1,602):**
Already filled in CSV as 1602.

**Cell C77 (LTV:CAC Ratio):**
```
=C76/C75
```
Drag right to column U.

**Cell C78 (Payback Period):**
Already filled in CSV as 5.2 months.

**Cell C79 (Net Revenue Retention):**
Already filled with assumptions in CSV. Format as percentage.

**Cell C80 (ARPA - Average Revenue Per Account):**
```
=IF(C21=0,0,C26/C21)
```
Drag right to column U.

#### HEADCOUNT

**Cell C83 (Total Employees):**
```
=COUNTA(C31:C36)
```
This counts non-empty salary rows. Drag right to column U.

### Step 4: Add Conditional Formatting

#### Highlight Cash Flow Issues
1. Select cells C70:U70 (Ending Cash Balance row)
2. **Format → Conditional formatting**
3. Format rules: **Less than** → `0`
4. Formatting style: **Red background**
5. Click **Done**

#### Highlight Profitability
1. Select cells C55:U55 (EBITDA row)
2. **Format → Conditional formatting**
3. Format rules: **Greater than** → `0`
4. Formatting style: **Green background**
5. Click **Done**

### Step 5: Create Charts

#### Chart 1: MRR Growth
1. Select cells B26:U26 (Total MRR row including month headers)
2. **Insert → Chart**
3. Chart type: **Line chart**
4. Customize:
   - Title: "Monthly Recurring Revenue (MRR) - 18 Month Projection"
   - Vertical axis: "MRR ($)"
   - Horizontal axis: "Month"
5. Click **Insert**

#### Chart 2: Cash Runway
1. Select cells B70:U70 (Ending Cash Balance)
2. **Insert → Chart**
3. Chart type: **Area chart**
4. Customize:
   - Title: "Cash Runway - 18 Month Projection"
   - Add reference line at $0
5. Click **Insert**

#### Chart 3: Customer Growth
1. Select cells B21:U21 (Total Cumulative Customers)
2. **Insert → Chart**
3. Chart type: **Column chart**
4. Title: "Customer Growth - Cumulative"

### Step 6: Add Additional Sheets (Optional)

Create these additional tabs for investor analysis:

#### Tab 2: Sensitivity Analysis
1. Click **+** to add new sheet
2. Name it "Sensitivity Analysis"
3. Create a table testing different scenarios:
   - Best Case (30% higher customer acquisition)
   - Base Case (current model)
   - Worst Case (30% lower customer acquisition)

#### Tab 3: Unit Economics Deep Dive
1. Add new sheet "Unit Economics"
2. Break down:
   - CAC by channel (organic, paid, referral)
   - LTV calculations by tier
   - Cohort retention curves

#### Tab 4: Hiring Plan
1. Add new sheet "Hiring Plan"
2. Detail each role with:
   - Job title
   - Salary
   - Start month
   - Department

## Advanced Formulas (Optional Enhancements)

### Dynamic CAC Calculation
Replace static CAC with actual calculation based on marketing spend:

**Cell D75:**
```
=IF(D11=0,284,D47/D11)
```
This divides total marketing spend by new customers acquired.

### Churn Impact on Customers
Currently churn is shown but not applied. To apply churn to customer counts:

**Cell D21 (Total Cumulative Customers with churn):**
```
=C21+D11-D25
```
Where D25 is churned customers. This needs to be updated throughout.

### Revenue Recognition
If you want to show revenue recognition differently:

**Cell D53 (Recognized Revenue):**
```
=(C21*C26)+(D11*D26*0.5)
```
This assumes new customers only pay half month's revenue.

## Validation Checks

After setting up, verify these key milestones from your business plan:

- [ ] Month 1 MRR: ~$3,840 (should match row 26, column D)
- [ ] Month 3 MRR: ~$18,740 (column F)
- [ ] Month 6 MRR: ~$49,206 (column I)
- [ ] Month 12 MRR: ~$213,456 (column O)
- [ ] Month 18 MRR: ~$535,848 (column U)

- [ ] Starting cash: $1,500,000
- [ ] Monthly burn Month 1: ~$71,500
- [ ] LTV:CAC ratio: 5.6:1 throughout
- [ ] Gross margin: 68%

## Common Issues & Fixes

### Issue: Numbers showing as text
**Fix:** Select cells → **Format → Number → Automatic**

### Issue: Formulas not calculating
**Fix:**
1. Check if "Automatic calculation" is enabled: **File → Spreadsheet settings → Calculation**
2. Set to "On change and every minute"

### Issue: Circular reference errors
**Fix:** This model shouldn't have circular references. Check that you haven't accidentally referenced a cell to itself.

### Issue: #DIV/0! errors
**Fix:** These occur when dividing by zero (usually Month 0). The IF statements should prevent this, but if you see them, add:
```
=IF(C21=0,0,your_formula_here)
```

## Sharing with Investors

### Method 1: View-Only Link
1. Click **Share** button (top right)
2. Change to "Anyone with the link can **view**"
3. Copy link and send to investors

### Method 2: PDF Export
1. **File → Download → PDF**
2. Current sheet or All sheets
3. Send PDF via email

### Method 3: Make a Copy for Investors
1. **File → Make a copy**
2. Share the copy link
3. They can edit their own version for sensitivity analysis

## Next Steps

1. **Customize assumptions** in rows 11-15 based on your actual customer acquisition plans
2. **Update salaries** in rows 31-36 based on your actual hiring plan
3. **Adjust marketing spend** in row 45 based on your CAC targets
4. **Add milestones** as comments in specific month columns
5. **Create scenario tabs** for best/worst case projections

## Questions or Issues?

If you encounter any problems with the formulas or setup:
1. Check that you're starting from cell A1 when importing
2. Ensure all month columns are properly aligned
3. Verify that currency formatting is applied to dollar amounts
4. Make sure percentage cells are formatted as percentages (not decimals)

---

**Model Version:** 1.0
**Last Updated:** Based on PM33 Business Plan v10
**Assumptions:** Conservative base case with 18-month projection to Series A
