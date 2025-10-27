# MoodSync App - User Flow & Wireframes

## 📱 Mobile-First Design

The MoodSync app is designed with a mobile-first approach, featuring a clean and calming interface with soft blue and purple color palette.

---

## 🔄 User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     LOGIN SCREEN                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                  Addt-Moodayne                         │  │
│  │            Track your mood journey                     │  │
│  │                                                         │  │
│  │   [Email Input Field]                                  │  │
│  │   [Password Input Field]                               │  │
│  │   [Log In Button]                                      │  │
│  │                                                         │  │
│  │   Don't have an account? Sign Up                       │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    (After Login)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      HOME SCREEN                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  [☰]  Addt-Moodayne                          [🔍]     │  │
│  │                                                         │  │
│  │   Hi Anshah,                                           │  │
│  │   how are you feeling today?                           │  │
│  │                                                         │  │
│  │   [Log Mood Button]                                    │  │
│  │                                                         │  │
│  │   Today's Suggestion                                   │  │
│  │   Take a walk with Ashleigh                           │  │
│  │                                                         │  │
│  │   [View Social Board Button]                          │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         ↓                  ↓                    ↓
    [Log Mood]         [Menu (☰)]         [Social Board]
         ↓                  ↓                    ↓
┌──────────────┐   ┌──────────────┐   ┌──────────────────┐
│ MOOD CHECK-IN│   │  SIDE MENU   │   │  SOCIAL BOARD    │
│              │   │              │   │                  │
│ 😊 🙂 😐 😔  │   │  Profile     │   │  [Filter Tabs]   │
│              │   │  Dashboard   │   │                  │
│ [Note Field] │   │  Settings    │   │  User Posts:     │
│              │   │  Logout      │   │  • Undine        │
│ [Submit]     │   │              │   │  • Thahs         │
└──────────────┘   └──────────────┘   └──────────────────┘
         ↓
    [Submit Mood]
         ↓
    (Back to Home)
```

---

## 📋 Screen Details

### 1. **Login/Signup Screen**
- **Purpose**: User authentication
- **Features**:
  - Email and password input
  - Toggle between Login/Signup
  - Clean, minimal design
  - Secure authentication via Supabase

### 2. **Home Screen**
- **Purpose**: Main dashboard and quick actions
- **Features**:
  - Personalized greeting
  - "Log Mood" primary action button
  - Today's suggestion
  - Quick access to Social Board
  - Menu icon (hamburger) for navigation
  - Search functionality

### 3. **Mood Check-In Screen**
- **Purpose**: Log current mood
- **Features**:
  - 4 emoji mood selectors (Great, Good, Okay, Low)
  - Text field for notes/context
  - Visual feedback on mood selection
  - Submit button
  - Back navigation

### 4. **Suggestions Screen**
- **Purpose**: Provide personalized activity suggestions
- **Features**:
  - Display current suggestion
  - Accept or Skip buttons
  - "Suggest another" option
  - Suggestions based on mood patterns

### 5. **Social Board Screen**
- **Purpose**: Community sharing and support
- **Features**:
  - Category filters (Editing, Leadbn, Flet)
  - User posts with avatars
  - Like and comment functionality
  - Activity tags and categories

### 6. **Dashboard/Analytics Screen**
- **Purpose**: Visualize mood trends and patterns
- **Features**:
  - Energy Levels graph (7-day trend)
  - Peak Hours bar chart
  - Total logs counter
  - Day streak tracker
  - Beautiful gradient visualizations

### 7. **Side Menu**
- **Purpose**: Navigation and settings
- **Features**:
  - User profile display
  - Quick links to Profile, Dashboard, Settings
  - Logout option
  - Smooth slide-in animation

---

## 🎨 Design System

### Color Palette
- **Primary**: `#2D7A8B` (Teal Blue)
- **Secondary**: `#4FB3C5` (Light Turquoise)
- **Background**: `#E8F6F8` (Soft Blue-White)
- **Accent**: `#E8DFF5` (Light Purple)
- **Text Input**: `#F5F8FA` (Light Gray-Blue)

### Typography
- **Headings**: Large, clear, colored in primary teal
- **Body**: Readable, comfortable sizing
- **Buttons**: Medium weight, clear labels

### UI Elements
- **Cards**: Rounded corners (24px border-radius)
- **Buttons**: Pill-shaped for primary actions, rounded for secondary
- **Inputs**: Soft rounded rectangles
- **Spacing**: Generous padding for mobile comfort

---

## 🔐 Security Features

1. **Authentication**: Supabase Auth with email/password
2. **Data Protection**: All mood entries are user-specific
3. **Session Management**: Automatic session restoration
4. **Secure API**: All requests require valid access token

---

## 📊 Key Features

1. **Mood Tracking**: Quick emoji-based mood logging with notes
2. **Personalized Suggestions**: Context-aware activity recommendations
3. **Social Community**: Share and connect with others
4. **Analytics**: Visualize mood patterns over time
5. **Streaks**: Track consistency and build habits
6. **Responsive**: Mobile-first, smooth animations

---

## 🚀 Navigation Flow Summary

```
Login → Home → [Mood Check-in | Social Board | Menu]
                     ↓              ↓           ↓
                 Submit         View Posts   Dashboard/Settings
                     ↓              ↓           ↓
                   Home           Home        Home
```

---

## 💡 Future Enhancements

- Push notifications for reminders
- Mood-based music recommendations
- Export mood data
- Privacy controls for social sharing
- Dark mode support
- Multiple language support
