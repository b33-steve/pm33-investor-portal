# Email Submission Tracking Setup for PM33 Investor Portal

## Current Implementation

The investor portal currently logs email submissions to the **browser console**:

```javascript
console.log('INVESTOR LEAD:', {
  name: 'John Doe',
  email: 'john@example.com',
  firm: 'Acme Ventures',
  title: 'Partner',
  investmentInterest: '$100K',
  timestamp: '2024-10-28T10:30:00.000Z'
});
```

## How to See Submissions (3 Options)

### **Option 1: Google Sheets (Recommended - FREE)**

**Setup (5 minutes):**

1. Create a Google Form with these fields:
   - Name (Short answer)
   - Email (Short answer)
   - Firm (Short answer)
   - Title (Short answer)
   - Investment Interest (Dropdown: $25K, $50K, $100K, $250K+)

2. Get the form's pre-filled link:
   - Click the three dots → "Get pre-filled link"
   - Fill dummy data and get URL
   - Extract field IDs from URL

3. Update the HTML form submission:
   ```javascript
   // Replace the console.log in investor-portal-slides.html
   async function handleEmailSubmit(formData) {
     const googleFormUrl = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';

     const params = new URLSearchParams({
       'entry.123456789': formData.name,      // Replace with your field IDs
       'entry.987654321': formData.email,
       'entry.456789123': formData.firm,
       'entry.789123456': formData.title,
       'entry.321654987': formData.investmentInterest
     });

     await fetch(googleFormUrl + '?' + params.toString(), {
       method: 'POST',
       mode: 'no-cors'
     });

     // Show success message
     showSuccessScreen();
   }
   ```

4. View responses in Google Sheets (auto-created with form)

**Pros:**
- ✅ FREE
- ✅ No coding required
- ✅ Instant email notifications
- ✅ Data in spreadsheet format
- ✅ Easy to share with team

**Cons:**
- ❌ Requires form setup
- ❌ No analytics dashboard

---

### **Option 2: Formspree (Easy Paid Option - $10/month)**

**Setup (2 minutes):**

1. Sign up at https://formspree.io
2. Create a new form
3. Get your form endpoint (e.g., `https://formspree.io/f/xyyaabbcc`)
4. Update HTML:
   ```javascript
   async function handleEmailSubmit(formData) {
     await fetch('https://formspree.io/f/xyyaabbcc', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(formData)
     });

     showSuccessScreen();
   }
   ```

5. Submissions appear in Formspree dashboard and email

**Pros:**
- ✅ 2-minute setup
- ✅ Email notifications
- ✅ Spam protection
- ✅ CSV export
- ✅ Webhook support

**Cons:**
- ❌ $10/month (free tier limited to 50 submissions)

---

### **Option 3: Custom Backend (Most Control)**

**Setup (30-60 minutes):**

Create a simple serverless function (Vercel Functions or AWS Lambda):

**File: `/api/investor-lead.js` (Vercel)**
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, firm, title, investmentInterest } = req.body;

  // Option A: Send to your email via SendGrid
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  await sgMail.send({
    to: 'investors@pm-33.io',
    from: 'noreply@pm-33.io',
    subject: `New Investor Lead: ${name} from ${firm}`,
    html: `
      <h2>New Investor Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Firm:</strong> ${firm}</p>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Investment Interest:</strong> ${investmentInterest}</p>
      <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    `
  });

  // Option B: Save to database (Supabase, Firebase, etc.)
  // await supabase.from('investor_leads').insert({ name, email, firm, title, investmentInterest });

  res.status(200).json({ success: true });
}
```

**Update HTML:**
```javascript
async function handleEmailSubmit(formData) {
  await fetch('/api/investor-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });

  showSuccessScreen();
}
```

**Pros:**
- ✅ Full control
- ✅ Custom logic (auto-send deck, CRM integration)
- ✅ Database storage
- ✅ Analytics

**Cons:**
- ❌ Requires coding
- ❌ Need email service (SendGrid, Postmark)
- ❌ Hosting costs

---

## Recommended Setup: Google Sheets (for MVP)

**Step-by-step:**

1. Go to https://forms.google.com
2. Create new form: "PM33 Investor Leads"
3. Add fields (exact names):
   - Name
   - Email
   - Company/Firm
   - Title
   - Investment Amount
4. Click "Responses" tab → Create Spreadsheet
5. Get pre-filled link to extract field IDs
6. Update HTML file with the field IDs
7. Test by submitting through your portal

**Email Notifications:**
- In Google Sheets: Tools → Notification rules
- Set: "Notify me when... A user submits a form"
- You'll get instant email alerts

---

## Investor Package Automation

Once you capture an email, you can:

### **Manual Process (Day 1):**
1. Get email notification
2. Send personalized email with:
   - Full investor deck PDF
   - Financial projections link
   - Calendar link for call
   - Data room access

### **Automated (Future):**
Use a tool like:
- **Zapier**: Form submission → Send email with attachments
- **Make.com** (Integromat): Same but more customizable
- **Custom**: Vercel function sends email immediately

**Sample Auto-Response:**
```
Subject: PM33 Investor Materials - [Name]

Hi [Name],

Thank you for your interest in PM33! Here are the materials you requested:

📊 Full Investor Deck: [Link to PDF]
💰 Financial Projections: [Google Sheets link]
📅 Schedule a Call: [Calendly link]
📁 Data Room Access: [Link]

Key highlights:
• 5.6:1 LTV:CAC ratio
• 68% gross margins
• $100K MRR target Q1 2026
• Enterprise beta customers: LG, Accenture

Looking forward to discussing how PM33 can accelerate your portfolio's product velocity.

Best,
Steven Saper
CEO & Co-Founder, PM33
investors@pm-33.io
```

---

## Current File Location

**Investor Portal:** `/Users/ssaper/Desktop/my-projects/PM33 Investor Presentation/investor-portal-slides.html`

**To Enable Tracking:**
1. Choose Option 1, 2, or 3 above
2. Find the `handleEmailSubmit` function (around line 1450)
3. Replace `console.log` with your chosen tracking method
4. Test submission
5. Verify you receive the data

---

## Quick Start (Google Sheets - 5 min)

```bash
# 1. Create Google Form at forms.google.com
# 2. Get field IDs from pre-filled link
# 3. Update this section in your HTML:

function handleEmailSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // REPLACE THIS with your Google Form URL and field IDs
  const googleFormUrl = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
  const params = new URLSearchParams({
    'entry.XXXXX': data.name,
    'entry.YYYYY': data.email,
    'entry.ZZZZZ': data.firm,
    'entry.AAAAA': data.title,
    'entry.BBBBB': data.investmentInterest
  });

  fetch(googleFormUrl + '?' + params.toString(), {
    method: 'POST',
    mode: 'no-cors'
  }).then(() => {
    document.getElementById('emailForm').style.display = 'none';
    document.getElementById('successScreen').style.display = 'flex';
  });
}
```

Done! You'll now receive investor leads in Google Sheets with instant email notifications.
