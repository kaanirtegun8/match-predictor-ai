# Match Predictor AI

## Folder Structure 📁
```
src/
├── app/              # Expo Router pages
│   ├── (auth)/      # Auth group - unauthenticated
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/      # Tab navigation group
│   │   ├── bulletin.tsx  # Matches list
│   │   ├── account.tsx   # User profile & settings
│   │   └── _layout.tsx   # Tab bar configuration
│   ├── match/       # Match details & analysis
│   │   └── [id].tsx
│   ├── standings/   # League standings
│   │   └── [id].tsx
│   ├── analyze/     # Match analysis
│   │   └── [id].tsx
│   └── _layout.tsx  # Root layout with auth protection
├── components/
│   ├── auth/        # Authentication related components
│   ├── themed/      # Themed components
│   │   ├── ThemedText.tsx
│   │   └── ThemedView.tsx
│   ├── FilterBar.tsx
│   ├── LeagueSection.tsx
│   ├── MatchCard.tsx
│   └── RichText.tsx
├── services/
│   ├── auth.ts      # Auth services
│   ├── footballApi.ts # Football data API
│   └── openaiApi.ts  # OpenAI integration
└── models/
    └── AnalyzeResponseModel.ts
```

## Completed Features
- ✅ Basic app structure with Expo Router
- ✅ Firebase configuration
- ✅ Authentication UI (Login/Register screens)
- ✅ Email/Password Authentication
- ✅ Google Sign-In (iOS & Android)
- ✅ Protected routes
- ✅ User state management with Firebase Auth
- ✅ Match listing with league filtering
- ✅ League standings view
- ✅ Match details screen
- ✅ Basic match analysis with OpenAI

## Cloud Functions & Firebase Structure

### Cloud Functions

#### 1. fetchDailyBulletin ✅
- **Trigger**: Scheduled, runs daily at 04:00 (Europe/Istanbul)
- **Purpose**: Fetches and saves daily match data and standings
- **Process**:
  1. Fetches matches for next 2 days from API
  2. Saves matches to Firebase
  3. Fetches and saves standings for each competition
  4. Creates a trigger document for match details processing
  5. Implements rate limiting (6s delay between standings)

#### 2. processMatchDetailsV2 ✅
- **Trigger**: On document write in `triggers` collection
- **Purpose**: Processes detailed match information in batches
- **Process**:
  1. Processes matches in batches of 10
  2. For each match in batch:
     - Fetches match details
     - Fetches head-to-head data
     - Fetches recent matches for both teams
  3. Waits 30 seconds between matches
  4. Creates new trigger for next batch if needed

#### 3. manualFetchBulletin ✅
- **Type**: HTTP endpoint
- **Purpose**: Manual testing and triggering of bulletin fetch
- **Features**:
  - Can specify custom date via query parameter
  - Uses same logic as scheduled function

### Firebase Structure

#### Current Structure ✅
```
dailyBulletins/
  ├── 2024-01-13/
  │   ├── matches: Match[]
  │   ├── allDetailsProcessed: boolean
  │   ├── lastProcessedIndex: number
  │   ├── standings (collection)/
  │   │   └── {competitionId}/
  │   │       └── standingsData
  │   └── matchDetails (collection)/
  │       └── {matchId}/
  │           ├── details: Match
  │           ├── h2h: Match[]
  │           ├── homeRecentMatches: Match[]
  │           ├── awayRecentMatches: Match[]
  │           └── lastUpdated: timestamp

triggers/
  └── {triggerId}/
      ├── type: "processMatchDetails"
      ├── date: string
      ├── timestamp: timestamp
      └── status: string
```

#### Planned Structure 🔄
```
dailyBulletins/
  ├── 2024-01-13/
  │   ├── matches: Match[]
  │   └── matchDetails (collection)/
  │       ├── 498803/
  │       │   ├── details: MatchDetails
  │       │   ├── h2h: HeadToHead
  │       │   └── recentMatches: {
  │       │       [teamId]: Match[]
  │       │   }
  │       └── 498804/...
```

## Cloud Function Optimizations

### Completed ✅
- [x] API rate limit management (60s delay)
- [x] Group size optimization (2 matches/group)
- [x] Error handling improvements
- [x] Queue system implementation
- [x] Timeout management (540s)

### TODO 📝
- [ ] Migrate Firestore structure to sub-collections
- [ ] Implement retry mechanism for failed matches
- [ ] Optimize inter-process wait times
- [ ] Set up monitoring and alerting system
- [ ] Implement cache invalidation strategy
- [ ] Enhance error logging
- [ ] Implement API fallback mechanism

## API Rate Limits
- 10 requests/minute
- 4 requests per match:
  1. Match details
  2. Head-to-head
  3. Home team recent matches
  4. Away team recent matches

## Error Handling
- API errors
- Timeout errors
- Rate limit exceeded
- Firebase read/write errors

## Performance Considerations
- Firestore document size limit (1MB)
- Cloud Function timeout limit (540s)
- API rate limiting
- Number of concurrent operations

## Monitoring
- Cloud Logging
- Error tracking
- Process status monitoring
- Queue monitoring

## In Progress
- Advanced match analysis
- Performance optimizations
- UI/UX improvements

## Known Issues
1. Performance Issues:
   - Bulletin screen: Slow initial load of matches
   - Match detail screen: Performance lag when loading data
   - Analysis screen: Delay in OpenAI response

2. API Integration:
   - Need to implement proper error handling for API failures
   - Rate limiting considerations for football-data.org API
   - OpenAI API response parsing improvements needed

3. UI/UX:
   - iOS specific spacing issues in some components
   - Need to optimize images and implement proper loading states
   - Improve error states and user feedback

## Next Steps
1. Optimize bulletin screen performance:
   - Implement pagination for matches
   - Add proper loading states
   - Cache API responses

2. Improve match detail screen:
   - Optimize data loading
   - Add loading skeletons
   - Implement data caching

3. Enhance analysis feature:
   - Improve OpenAI prompt engineering
   - Add retry mechanism for failed requests
   - Implement result caching

4. General improvements:
   - Add proper error boundaries
   - Implement analytics
   - Add unit tests
   - Optimize bundle size 

## Recent Updates & Manual Testing Guide

### Firebase Cache Implementation ✅
- [x] Implemented Firebase caching for standings data
- [x] Added cache check before API calls
- [x] Structure: `dailyBulletins/${date}/standings/${leagueId}`

### Manual Testing Steps 🧪

#### Standing Cache Testing
1. Open standings page for a league
2. Check console logs:
   - "🔍 Checking Firebase for standings..." should appear
   - Either "✅ Standings found in Firebase cache" or "❌ Standings not found in Firebase" will follow
3. Verify data display:
   - Table should show correct standings
   - Loading states should work properly

#### Cloud Function Testing
1. Monitor Firestore:
   - Check `dailyBulletins` collection for new documents
   - Verify `standings` subcollection is populated
2. Function Logs:
   - Check Firebase Console > Functions
   - Verify successful execution
   - Monitor for any errors

#### Manual Trigger URLs 🔗
- **Manual Fetch Bulletin**:
  ```
  https://europe-west1-match-predictor-ai.cloudfunctions.net/manualFetchBulletin
  ```
  - Optional query parameter: `?date=YYYY-MM-DD`
  - Example: `https://europe-west1-match-predictor-ai.cloudfunctions.net/manualFetchBulletin?date=2024-01-20`
  - If no date provided, uses current date

### Performance Improvements ✅
- [x] Optimized standings data retrieval
- [x] Implemented proper Firebase document structure
- [x] Added console logging for debugging

### Known Issues & Monitoring
1. Cache Validation:
   - Need to implement cache invalidation strategy
   - Consider implementing TTL for cached data

2. Error States:
   - Handle Firebase connection errors
   - Implement fallback to API when Firebase fails 