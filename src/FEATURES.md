# A&R MoodSync - Enhanced Features & Mobility

## 🎨 Updated Color System
The app now uses a cohesive sage green color palette throughout:
- **Sage Light**: #E8F6F8 (backgrounds)
- **Sage Base**: #A8C9C7 (secondary elements)
- **Sage Medium**: #4A7B78 (text)
- **Sage Dark**: #2F5956 (headings)
- **Ocean**: #4FB3C5 (primary actions)
- **Ocean Dark**: #2D7A8B (primary text)
- **Success**: #7DD4A8 (positive indicators)
- **Warning**: #FFB84D (alerts)
- **Danger**: #FF6B6B (destructive actions)
- **Purple**: #9B7FD8 (accents)

## 📱 New Navigation System

### Bottom Navigation Bar
- **5 core tabs** accessible via bottom navigation:
  1. 🏠 Dashboard - Unified mood logging & daily highlights
  2. 📊 Analytics - Detailed mood/time-of-day trends
  3. 📅 History - Calendar view of mood entries
  4. 🧠 Insights - Viva Insights inspired wellbeing & focus guidance (NEW)
  5. 👤 Profile - User settings & export

### Floating Action Button
- Quick access to mood check-in from any main screen
- Animated with spring physics
- Fixed position above bottom nav

## 🆕 New Features

### Viva Insights Style Intelligence (`InsightsHub.tsx`) ✅ NEW
Brings a wellness & productivity intelligence layer similar to Microsoft Viva Insights.
- **Daily Briefing**: Snapshot of wellbeing score, consistency, average mood, focus window.
- **Wellbeing Score**: Composite (mood quality + stability + logging consistency) shown as a progress bar.
- **Focus Time Recommendation**: Calculates best 2-hour deep work block from historical high-intensity mood periods.
- **Break Reminders**: Configurable interval (30–120 min) with auto toast prompts and manual "Log Break" action.
- **Quiet Hours**: Set start/end (e.g. 22 → 7). Tracks how many entries occur during restorative time.
- **Weekly Digest**: Summarizes entries, average mood, most frequent mood, and top note themes extracted from recent logs.
- **Burnout Risk Heuristic**: Simple triage (low/medium/high) based on low mood ratio, variance, and consistency.
- **Accessibility & Performance**: All metrics memoized; ARIA attributes on inputs.

### 1. **Mood Calendar** (`MobileMoodCalendar.tsx`)
- Monthly calendar view with color-coded days
- Each day shows average mood with color indicator
- Click any day to view detailed entries
- Mood legend for easy reference
- Month navigation with prev/next buttons
- Visual indicators for multiple entries per day

### 2. **Profile Screen** (`MobileProfile.tsx`)
- User avatar with initial
- Stats display:
  - Total moods logged
  - Current streak counter
- Settings section:
  - Push notifications toggle
  - Dark mode toggle (coming soon)
  - Export data option
  - App settings
- Logout functionality

### 3. **Breathing Exercise** (`MobileBreathing.tsx`)
- Guided breathing animation
- 4-4-6 breathing pattern (inhale-hold-exhale)
- Real-time visual circle that grows/shrinks
- Countdown timer for each phase
- Session tracking:
  - Total cycles completed
  - Time spent
  - Current phase
- Play/Pause controls
- Reset button
- Instructions included

### 4. **Enhanced Home Screen**
- Redesigned greeting card
- Quick action buttons:
  - Breathing exercises
  - Community access
- Daily tip display
- Dynamic suggestions based on check-in status

### 5. **Smart AI Flow**
- Auto-triggers AI suggestions after mood check-in
- Prioritizes suggestions for low mood (≤2)
- Returns to home for good moods
- Seamless flow to break buddy finder

## 🎯 Enhanced User Experience

### Improved Flow
```
Login → Home → [Quick Actions]
         ↓
      Check In → AI Suggestions (if mood ≤ 2) → Break Buddy
         ↓                ↓
      Dashboard    Return to Home
```

### Visual Improvements
- Smooth page transitions with AnimatePresence
- Spring animations for interactions
- Color-coded mood indicators
- Consistent rounded corners (12-24px)
- Shadow depth for card hierarchy
- Active state animations in bottom nav

### Mobile Optimizations
- Safe area padding for bottom nav
- Touch-friendly button sizes (min 44px height)
- Swipe-ready architecture
- Haptic-ready interactions
- Progressive disclosure of information
- Empty states for all screens

## 📊 Features by Screen

### Home
- Personalized greeting
- Quick check-in button
- Breathing exercise access
- Community preview
- Daily tip

### Calendar
- Month view with mood colors
- Day details on tap
- Navigation between months
- Legend for mood levels
- Empty state

### Dashboard
- Enhanced mood logger with quick notes
- Recent entry list with time-ago formatting
- Weekly trend indicator & streak counter
- Success animations on log

### Analytics
- Time-range filtering (7d / 30d / all time)
- Time-of-day pattern averages (morning/afternoon/evening)
- Smart insights cards
- Per-entry timestamp plotting

### History
- Monthly calendar with multi-entry count badges
- Day detail panel supports multiple entries
- Color-coded intensity averages

### Insights (NEW)
- Daily briefing snapshot
- Wellbeing score bar & variance stats
- Focus time recommendation
- Break reminder engine with countdown
- Quiet hours configuration
- Weekly digest + note theme extraction

### Profile
- Stats & streak display
- Export data (existing)
- Logout & session management

### Social
- Community mood board
- Filter by category
- Share functionality
- Anonymous option

### Profile
- User stats & streak
- Notification settings
- Export data
- App settings
- Logout

## 🔧 Technical Improvements

### State Management
- Streak calculation from entries
- Daily check-in tracking
- Screen state persistence
- Session management

### Performance
- Lazy loading of screens
- Optimized re-renders
- Efficient animations
- Memory-conscious state

### Accessibility
- Color contrast ratios
- Touch target sizes
- Semantic HTML
- Screen reader support

## 🎨 Design System

### Typography
- Headings: 18-28px
- Body: 14-16px
- Captions: 12px

### Spacing
- Base unit: 4px
- Common gaps: 12px, 16px, 24px
- Section spacing: 24-32px

### Border Radius
- Small: 12px
- Medium: 16px
- Large: 24px
- XL: 32px

### Shadows
- Subtle: 0 1px 3px rgba(0,0,0,0.1)
- Card: 0 2px 8px rgba(0,0,0,0.08)

## 🚀 Future Enhancements
- Advanced predictive focus windows (machine learning)
- Mood → task correlation insights
- Cross-day energy recovery charts
- CSV/PDF export of insights & trends
- Push notifications for quiet hours + breaks
- Team / group wellbeing aggregation
- Challenges & goal tracking per week
- Sentiment analysis of notes (NLP)
