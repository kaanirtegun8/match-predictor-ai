# Match Predictor AI - Development Notes

## Project Overview 🎯
Futbol maç tahmin uygulaması:
- Data Kaynağı: football-data.org API
- AI Analiz: OpenAI entegrasyonu
- Authentication: Firebase Auth + Google Authentication
- Database: Firebase
- Üyelik Sistemi: Free ve Premium kullanıcı tipleri

## Folder Structure 📁
```
src/
├── app/              # Expo Router pages
│   ├── (auth)/      # Auth group - unauthenticated
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/      # Tab navigation group
│   │   ├── bulletin/  # or matches/
│   │   │   ├── [id].tsx  # Match detail route
│   │   │   └── index.tsx # Matches/Bulletin list
│   │   ├── account/
│   │   │   └── index.tsx # User profile & settings
│   │   └── _layout.tsx   # Tab bar configuration
│   ├── predictions/  # Modal screens (non-tab routes)
│   │   ├── [id].tsx
│   │   └── index.tsx
│   ├── _layout.tsx  # Root layout
│   └── index.tsx    # Entry redirect
├── api/
│   ├── football-data/ # Football-data.org API calls
│   ├── openai/        # OpenAI integration
│   └── firebase/      # Firebase services
├── components/
│   ├── auth/          # Authentication related components
│   ├── matches/       # Match listing and details
│   ├── predictions/   # Prediction related components
│   ├── analysis/      # Analysis display components
│   └── common/        # Shared components
├── store/            # State management
├── hooks/            # Custom hooks
├── types/            # TypeScript types/interfaces
├── utils/            # Helper functions
├── constants/        # App constants and config
└── styles/          # Global styles and themes
```

## Completed Tasks ✅
- Set up initial React Native project with Expo
- Added ExternalLink component
- Fixed type issues in ExternalLink component

## Planned Tasks 📋
### Phase 1: Setup & Infrastructure
- [ ] Initialize Firebase project
- [ ] Set up Firebase Authentication (Email + Google)
- [ ] Create basic folder structure
- [ ] Set up football-data.org API integration
- [ ] Configure environment variables

### Phase 2: Authentication & User Management
- [ ] Implement user registration
- [ ] Implement login system
- [ ] Create user profile management
- [ ] Implement subscription system (Free/Premium)

### Phase 3: Core Features
- [ ] Implement football matches fetching
- [ ] Create match listing UI
- [ ] Implement match detail views
- [ ] Set up OpenAI integration for match analysis
- [ ] Create prediction generation system
- [ ] Implement prediction history

### Phase 4: Premium Features
- [ ] Detailed match statistics
- [ ] Advanced AI analysis
- [ ] Historical performance data
- [ ] Custom prediction parameters

### Phase 5: Polish & Optimization
- [ ] Add loading states
- [ ] Implement error handling
- [ ] Add offline support
- [ ] Optimize performance
- [ ] Add analytics

## Technical Requirements 🔧
- React Native with Expo
- TypeScript
- Firebase (Authentication, Firestore, Cloud Functions)
- OpenAI API
- football-data.org API
- Redux/Context for state management
- React Navigation

## API Integration Points 🔌
1. Football-Data.org
   - Maç listesi
   - Maç detayları
   - Takım istatistikleri
   - Lig bilgileri

2. Firebase
   - User authentication
   - User data storage
   - Prediction history
   - Subscription management

3. OpenAI
   - Maç analizi
   - Tahmin hesaplamaları
   - İstatistik yorumlaması

## Subscription Features 💎
### Free Tier
- Basic match predictions
- Limited daily predictions
- Basic statistics

### Premium Tier
- Unlimited predictions
- Detailed match analysis
- Historical data access
- Advanced statistics
- Custom parameters for predictions 

## Tab Navigation Structure 🗺
### Bottom Tabs
1. Bulletin/Matches Tab
   - Maç bülteni listesi
   - Maç detay sayfası (modal olarak açılabilir)
   - Lig filtreleme
   - Tarih seçimi

2. Account Tab
   - Kullanıcı profili
   - Abonelik durumu
   - Tahmin geçmişi
   - Ayarlar
   - Çıkış

### Modal Screens (Tab dışı)
- Prediction detay/oluşturma
- Maç analiz detayları
- Premium özellikler 