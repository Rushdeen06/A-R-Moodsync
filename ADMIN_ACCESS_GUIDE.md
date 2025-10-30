# Admin Dashboard Access Guide

## Temporary Testing Access

Since role-based authentication is not yet implemented, here are ways to access the Admin Dashboard for testing:

### Method 1: Browser Console (Quickest)

1. Start the dev server: `npm run dev`
2. Open the app in your browser: http://localhost:3000
3. Log in to the app
4. Open browser console (F12 or right-click → Inspect → Console)
5. Find the React root element and trigger navigation:
   ```javascript
   // This will depend on your app structure, but you can manually trigger:
   // Navigate by clicking the Profile tab, then in console:
   document.querySelector('[data-screen="admin"]')?.click();
   ```

### Method 2: Add Admin Tab to Bottom Nav (Easiest for Testing)

Edit `src/components/mobile/MobileBottomNav.tsx`:

```typescript
import { Users } from 'lucide-react'; // Add this import

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'social', icon: Calendar, label: 'Social' },
  { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
  { id: 'insights', icon: Brain, label: 'Insights' },
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'admin', icon: Users, label: 'Admin' }, // Add this line
];
```

**Remember to remove this after testing!**

### Method 3: Add Test Button in Profile (Recommended for Development)

Edit `src/components/mobile/MobileProfile.tsx`:

1. Add `onNavigate` prop to interface:
```typescript
interface MobileProfileProps {
  userName: string;
  userEmail: string;
  totalEntries: number;
  currentStreak: number;
  onLogout: () => void;
  onNavigate?: (screen: string) => void; // Add this
}
```

2. Destructure the prop:
```typescript
export function MobileProfile({ 
  userName, 
  userEmail, 
  totalEntries, 
  currentStreak, 
  onLogout,
  onNavigate // Add this
}: MobileProfileProps) {
```

3. Add a test button in the profile (after the stats section):
```typescript
{/* Admin Access (Development Only) */}
{onNavigate && (
  <motion.button
    onClick={() => onNavigate('admin')}
    className="w-full flex items-center justify-between p-4 rounded-2xl transition-all"
    style={{ 
      backgroundColor: isDark ? '#2d2d2d' : 'white',
      border: '2px dashed #FFB84D'
    }}
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
  >
    <div className="flex items-center gap-3">
      <Users className="w-5 h-5" style={{ color: '#FFB84D' }} />
      <div className="text-left">
        <p className="text-sm font-semibold" style={{ color: isDark ? '#fff' : '#2D7A8B' }}>
          Admin Dashboard (Test)
        </p>
        <p className="text-xs" style={{ color: isDark ? '#999' : '#A8C9C7' }}>
          HR/Employer Wellness Insights
        </p>
      </div>
    </div>
    <ChevronRight className="w-5 h-5" style={{ color: '#FFB84D' }} />
  </motion.button>
)}
```

4. Update `App.tsx` to pass the navigation handler:
```typescript
{currentScreen === 'profile' && (
  <Suspense fallback={<LoadingFallback />}>
    <MobileProfile
      userName={user!.name}
      userEmail={user!.email}
      totalEntries={entries.length}
      currentStreak={currentStreak}
      onLogout={handleLogout}
      onNavigate={(screen) => setCurrentScreen(screen as Screen)} // Add this
    />
  </Suspense>
)}
```

## Future: Role-Based Access

For production deployment, implement proper role-based access:

### 1. Update User Interface

```typescript
interface User {
  name: string;
  email: string;
  accessToken: string;
  role: 'employee' | 'hr' | 'admin'; // Add this
}
```

### 2. Backend API Changes

Add role field to user authentication response:
```javascript
// server/index.js
app.post('/api/auth/login', async (req, res) => {
  // ... existing login logic
  
  res.json({
    accessToken: token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role // Add this
    }
  });
});
```

### 3. Conditional Navigation

Update `MobileBottomNav.tsx`:
```typescript
interface MobileBottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  userRole?: 'employee' | 'hr' | 'admin'; // Add this
}

export function MobileBottomNav({ currentScreen, onNavigate, userRole }: MobileBottomNavProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'social', icon: Calendar, label: 'Social' },
    { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
    { id: 'insights', icon: Brain, label: 'Insights' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  // Add admin tab only for HR/admin users
  if (userRole === 'hr' || userRole === 'admin') {
    navItems.push({ id: 'admin', icon: Users, label: 'Admin' });
  }

  // ... rest of component
}
```

### 4. Route Protection

Add route guard in `App.tsx`:
```typescript
{currentScreen === 'admin' && (
  <>
    {user?.role === 'hr' || user?.role === 'admin' ? (
      <Suspense fallback={<LoadingFallback />}>
        <AdminDashboard
          entries={entries}
          onBack={() => setCurrentScreen('home')}
        />
      </Suspense>
    ) : (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to view this page.
          </p>
          <Button onClick={() => setCurrentScreen('home')}>
            Go to Home
          </Button>
        </div>
      </div>
    )}
  </>
)}
```

## Testing Checklist

After adding admin access, verify:

- [ ] Admin dashboard loads without errors
- [ ] All analytics display correctly (wellbeing score, participation, etc.)
- [ ] Time range selector works (Last 7/30/90 days)
- [ ] Mood distribution chart renders properly
- [ ] Recommendations section shows relevant insights
- [ ] Privacy notice is visible and clear
- [ ] Back button returns to home screen
- [ ] Bottom navigation stays visible on admin screen

## Production Deployment

Before deploying to production:

1. **Remove all test/development access methods**
2. **Implement proper authentication and authorization**
3. **Add backend API protection for admin endpoints**
4. **Implement audit logging for admin actions**
5. **Add data export/reporting features**
6. **Test with real multi-tenant data**
7. **Verify GDPR compliance for employee data**
