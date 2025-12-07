# 🎯 SIREN - Complete Installation & Testing Guide

## ✅ Pre-Installation Checklist

Before you begin, ensure you have:

- [ ] Windows OS (you're using cmd.exe)
- [ ] Node.js 18 or higher installed
- [ ] npm package manager
- [ ] Internet connection for dependencies
- [ ] Code editor (VS Code recommended)
- [ ] Modern web browser (Chrome/Firefox/Edge)

---

## 🚀 Installation Steps

### Step 1: Verify Node.js Installation

Open Command Prompt and run:

```cmd
node --version
npm --version
```

**Expected output:**

```
v18.x.x or higher
9.x.x or higher
```

If not installed, download from: https://nodejs.org

---

### Step 2: Navigate to Project Directory

```cmd
cd e:\Siren
```

---

### Step 3: Install Dependencies

**Option A: Use the Quick Start Script**

```cmd
start.bat
```

**Option B: Manual Installation**

```cmd
npm install
```

This will install:

- React 18
- React Router
- TailwindCSS
- Leaflet
- Recharts
- Axios
- And 20+ other dependencies

**⏱️ Installation time:** 2-5 minutes depending on your internet speed

---

### Step 4: Verify Installation

Check if node_modules folder was created:

```cmd
dir node_modules
```

You should see hundreds of packages listed.

---

## 🎮 Running the Application

### Start Development Server

```cmd
npm run dev
```

**Expected output:**

```
VITE v5.0.8  ready in 1234 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
➜  press h to show help
```

### Access the Application

Open your browser and navigate to:

```
http://localhost:3000
```

---

## 🧪 Testing Guide

### Test 1: Landing Page

**Steps:**

1. Navigate to http://localhost:3000
2. Verify landing page loads
3. Check hero section displays
4. Click "Request Emergency Help" button
5. Click "Volunteer Login" button

**Expected:** Page loads, buttons work, responsive design

---

### Test 2: User Registration

**Steps:**

1. Click "Register" in navbar
2. Select role: "Volunteer"
3. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Phone: "01712345678"
   - Password: "password123"
   - Confirm Password: "password123"
4. Check "I agree to terms"
5. Click "Create Account"

**Expected:** Registration successful, redirected to dashboard

---

### Test 3: Login (All Roles)

**Test as Victim:**

```
Email: victim@example.com
Password: password
Role: Victim
```

**Test as Volunteer:**

```
Email: volunteer@example.com
Password: password
Role: Volunteer
```

**Test as Official:**

```
Email: admin@example.com
Password: password
Role: Official
```

**Expected:** Login successful, dashboard loads with role-specific content

---

### Test 4: Submit Help Request

**Steps:**

1. Login as victim
2. Navigate to "Request Help"
3. Fill in:
   - Your Name: "Emergency Test"
   - Phone: "01712345678"
   - Address: "Test Address, Dhaka"
   - Emergency Type: "Flood"
   - Severity: "High"
   - Description: "Test emergency request for system validation"
4. Click "Capture Location" (may need to allow browser location access)
5. Click "Submit Emergency Request"

**Expected:**

- Location captured
- Form validates
- Success toast notification
- Redirected to dashboard

---

### Test 5: Live Map View

**Steps:**

1. Navigate to "Live Map" from sidebar
2. Wait for map to load
3. Observe markers on map
4. Click on a marker
5. View popup details

**Expected:**

- Map loads (OpenStreetMap)
- Multiple colored markers visible
- Popup shows request details
- Legend displays correctly

---

### Test 6: Requests List

**Steps:**

1. Navigate to "All Requests"
2. View the table of requests
3. Use search box: type "Flood"
4. Filter by severity: "Critical"
5. Click "View" on a request

**Expected:**

- Table displays all requests
- Search filters results
- Filters work correctly
- Modal shows full details

---

### Test 7: Volunteer Tasks (As Volunteer)

**Steps:**

1. Logout
2. Login as volunteer (volunteer@example.com / password)
3. Navigate to "My Tasks"
4. View pending tasks
5. Click "Accept Task"
6. Click "Update Status"
7. Add notes: "Task in progress"
8. Mark as "In Progress"

**Expected:**

- Tasks displayed by status
- Accept button works
- Status update modal opens
- Task status updates

---

### Test 8: Admin Panel (As Official)

**Steps:**

1. Logout
2. Login as official (admin@example.com / password)
3. Navigate to "Admin Panel"
4. View statistics cards
5. Observe charts loading
6. Scroll through analytics

**Expected:**

- Dashboard stats display
- 4 charts render (Line, Bar, Pie, Bar)
- Data visualizes correctly
- Responsive layout

---

### Test 9: AI Zone Predictions (As Official)

**Steps:**

1. Stay logged in as official
2. Navigate to "AI Predictions"
3. View map with zone overlays
4. Click on a colored circle
5. View zone in sidebar
6. Check recommendations

**Expected:**

- Map with colored zones
- Zone details display
- Risk scores visible
- Recommendations shown

---

### Test 10: Responsive Design

**Steps:**

1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different screen sizes:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1920px
4. Navigate through pages
5. Check sidebar behavior

**Expected:**

- Mobile: Sidebar collapses, hamburger menu appears
- Tablet: Cards stack, responsive grid
- Desktop: Full layout with sidebar

---

## 🐛 Troubleshooting

### Issue: Port 3000 already in use

**Solution:**

```cmd
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3001
```

---

### Issue: npm install fails

**Solution:**

```cmd
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

---

### Issue: Map not loading

**Solution:**

1. Check browser console for errors
2. Verify Leaflet CSS is imported in index.html
3. Check internet connection (loads tiles from OpenStreetMap)
4. Try refreshing the page

---

### Issue: "Module not found" errors

**Solution:**

```cmd
# Verify all dependencies installed
npm list

# Reinstall specific package
npm install <package-name>

# Restart dev server
npm run dev
```

---

### Issue: Styles not applying

**Solution:**

1. Check if TailwindCSS is configured
2. Verify `tailwind.config.js` exists
3. Check `index.css` imports Tailwind directives
4. Restart dev server

---

## 📊 Performance Testing

### Check Build Size

```cmd
npm run build
```

**Expected output:**

```
dist/index.html                   x.xx kB
dist/assets/index-xxxxx.css      xx.xx kB
dist/assets/index-xxxxx.js      xxx.xx kB
✓ built in x.xxs
```

### Test Production Build

```cmd
npm run preview
```

Access at: http://localhost:4173

---

## ✅ Feature Checklist

After testing, verify all features work:

### Authentication

- [ ] Login works for all roles
- [ ] Registration creates account
- [ ] Logout clears session
- [ ] Protected routes redirect

### Victim Features

- [ ] Can submit help requests
- [ ] Can view own requests
- [ ] Dashboard shows stats

### Volunteer Features

- [ ] Can view assigned tasks
- [ ] Can accept tasks
- [ ] Can update task status
- [ ] Can complete tasks

### Official Features

- [ ] Can access admin panel
- [ ] Can view all requests
- [ ] Can view analytics
- [ ] Can view AI predictions
- [ ] Can assign volunteers

### Common Features

- [ ] Map displays correctly
- [ ] Requests list works
- [ ] Search and filters work
- [ ] Modal popups work
- [ ] Toast notifications appear
- [ ] Navigation works
- [ ] Responsive design works

---

## 🎯 Acceptance Criteria

The application is ready when:

✅ All 10 tests pass
✅ No console errors (except mock data warnings)
✅ All features work as expected
✅ Responsive on all screen sizes
✅ Fast load times (<3 seconds)
✅ Smooth transitions and animations
✅ Toast notifications work
✅ Forms validate correctly
✅ Maps render properly
✅ Charts display data

---

## 📝 Notes

**Mock Data:**

- Application uses mock data by default
- Works without backend API
- Console warnings about "API not available" are normal
- Data resets on page refresh

**Browser Compatibility:**

- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

**Recommended Testing:**

- Test in Chrome first
- Then test in Firefox
- Check mobile view last

---

## 🎉 Success!

If all tests pass, congratulations! 🎊

Your SIREN disaster response system frontend is:

- ✅ Fully functional
- ✅ Production ready
- ✅ Well tested
- ✅ Ready for deployment

---

## 📞 Support

If you encounter issues:

1. Check error messages in browser console
2. Review SETUP_GUIDE.md
3. Check QUICK_REFERENCE.md
4. Verify Node.js and npm versions
5. Try clearing cache and reinstalling

---

## 🚀 Next Steps

After successful testing:

1. **Connect to Backend** - Update API_BASE_URL in .env
2. **Deploy** - Use Vercel, Netlify, or your hosting
3. **Customize** - Modify colors, content, features
4. **Scale** - Add more features as needed

---

**Happy Testing! 🧪**

_Last updated: December 7, 2024_
