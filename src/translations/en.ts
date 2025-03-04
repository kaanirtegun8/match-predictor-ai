export default {
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    or: 'or',
    notAvailable: 'N/A',
    retry: 'Retry',
  },
  auth: {
    signIn: 'Sign In',
    signOut: 'Sign Out',
    signUp: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    fullName: 'Full Name',
    welcomeBack: 'Welcome Back',
    welcomeSubtitle: 'Sign in to access your personalized match predictions',
    createAccount: 'Create Account',
    createAccountSubtitle: 'Join us to get AI-powered match predictions',
    noAccount: 'Don\'t have an account? Sign Up',
    haveAccount: 'Already have an account? Sign In',
    passwordsNoMatch: 'Passwords do not match',
    fillAllFields: 'Please fill in all fields',
    signInWithGoogle: 'Sign in with Google',
    signInWithFacebook: 'Sign in with Facebook',
    continueWithGoogle: 'Continue with Google',
    continueWithFacebook: 'Continue with Facebook',
    signingIn: 'Signing in...',
    loginRequired: 'Please sign in to analyze matches',
    login: 'Login',
  },
  navigation: {
    tabs: {
      matches: 'Matches',
      account: 'Account',
      bulletin: 'Bulletin',
    },
    titles: {
      myProfile: 'My Profile',
      matches: 'Matches',
      bulletin: 'Daily Bulletin',
      matchDetails: 'Match Details',
      standings: 'Standings',
      analysis: 'Analysis',
    },
  },
  matches: {
    upcoming: 'Upcoming Matches',
    live: 'Live Matches',
    finished: 'Finished Matches',
    noMatches: 'No matches found',
    matchday: 'Matchday',
    form: {
      win: 'W',
      loss: 'L',
      draw: 'D'
    },
    predictions: {
      title: 'Predictions',
      confidence: '{{percent}}% Confidence',
      types: {
        matchResult: 'Match Result',
        totalGoals: 'Total Goals',
        bothTeamsToScore: 'Both Teams to Score',
        homeTeamGoals: 'Home Team Goals',
        awayTeamGoals: 'Away Team Goals',
        firstGoal: 'First Goal'
      },
      risk: {
        RISKY: 'Risky',
        MODERATE: 'Moderate',
        SAFE: 'Safe'
      }
    },
    analysis: {
      title: 'Match Analysis',
      subtitle: 'AI-Powered insights and predictions',
      button: 'Analyze',
      showDetails: 'Show Details',
      hideDetails: 'Hide Details',
      error: 'Something went wrong while checking analysis limit. Please try again.',
      noEvidence: 'No detailed analysis available for this prediction.',
      loadingSteps: {
        stats: 'Retrieving match statistics...',
        performance: 'Analyzing team performances...',
        predictions: 'Generating AI predictions...',
        finalizing: 'Finalizing match insights...'
      }
    },
    headToHead: 'Head to Head',
    status: {
      live: 'LIVE',
      loadingDetails: 'Loading match details...',
      matchNotFound: 'Match not found'
    },
    filter: {
      title: 'Filter',
      allLeagues: 'All Leagues',
      allTeams: 'All Teams',
      apply: 'Apply',
      reset: 'Reset',
      selectLeague: 'Select League',
      selectTeam: 'Select Team',
      clearAll: 'Clear All',
      search: 'Search',
      noResults: 'No results found'
    }
  },
  settings: {
    title: 'Settings',
    language: 'Language',
    theme: 'Theme',
    notifications: 'Notifications',
    memberSince: 'Member since',
    accountType: {
      free: 'Free',
      premium: 'Premium'
    },
    subscription: 'Subscription',
    termsOfUse: 'Terms of Use',
    privacyPolicy: 'Privacy Policy',
    legal: 'Legal',
  },
  stats: {
    totalAnalyses: 'Total Analyses',
    thisMonth: 'This Month',
    mostActive: 'Most Active',
  },
  accountManagement: {
    title: 'Account Management',
    deleteAccount: 'Delete Account',
    deleteConfirmation: 'This action cannot be undone. Please enter your password to confirm.',
    continue: 'Continue',
    confirmPassword: 'Confirm Password',
    enterPassword: 'Please enter your password to delete your account',
    passwordRequired: 'Password is required',
    invalidPassword: 'Invalid password or something went wrong. Please try again.',
  },
  premium: {
    title: 'Premium',
    subscribe: 'Manage',
    restore: 'Restore Purchases',
    freePlan: 'Free Plan',
    analysesRemaining: 'Monthly analyses remaining: ',
    premiumToggleText: 'Premium Color',
    features: {
      unlimitedAnalysis: {
        title: 'Unlimited Analysis',
        description: 'Analyze any match, anytime'
      },
      detailedStats: {
        title: 'Detailed Statistics',
        description: 'Access to advanced stats'
      },
      matchAlerts: {
        title: 'Match Alerts',
        description: 'Get notified for important matches'
      },
      advancedAnalysis: {
        title: 'Advanced Analysis',
        description: 'Get detailed AI-powered analysis of matches with historical data and predictions'
      },
      historicalData: {
        title: 'Historical Data',
        description: 'Access comprehensive historical match data and team performance metrics'
      },
      smartAlerts: {
        title: 'Smart Alerts',
        description: 'Receive notifications for high-probability matches and important game events'
      }
    },
    upgradeToPremium: 'Upgrade to Premium',
    unlockPotential: 'Unlock the full potential of Match Predictor AI',
    choosePlan: 'Choose Your Plan',
    weekly: 'Weekly',
    monthly: 'Monthly',
    startFreeTrial: 'Start My Free Trial',
    processing: 'Processing...',
    continue: 'Continue',
    restorePurchases: 'Restore Purchases',
    purchaseError: 'An error occurred during purchase. Please try again.',
    restoreError: 'An error occurred while restoring purchases. Please try again later.',
    ok: 'OK',
    subscriptionInfo: 'Subscription Information',
    legalText: 'By subscribing, you agree to our Terms of Use and Privacy Policy. Subscriptions will automatically renew unless canceled at least 24 hours before the end of the current period.',
    duration: {
        weekly: 'Weekly subscription - renews every 7 days',
        monthly: 'Monthly subscription - renews every month',
        yearly: 'Yearly subscription - renews every year',
        simple: {
          weekly: 'Renews every 7 days,',
          monthly: 'Renews every month,',
          yearly: 'Renews every year,'
        }
      }
  },
  standings: {
    headers: {
      position: '#',
      team: 'Team',
      played: 'P',
      won: 'W',
      draw: 'D',
      lost: 'L',
      goalsFor: 'GF',
      goalsAgainst: 'GA',
      goalDifference: 'GD',
      points: 'Pts'
    },
    labels: {
      matchesPlayed: 'Matches Played',
      form: 'Form',
      nextMatch: 'Next Match'
    }
  },
  tutorial: {
    bulletin: {
      title: "Daily Match Bulletin",
      message: "Here you can see important matches of the day and access detailed analyses. Click on any match card to see detailed information."
    },
    match: {
      title: "Match Details",
      message: "Here you can see match information and detailed statistics. You can also click the Analyze button to see detailed match analysis."
    },
    buttons: {
      next: "Next",
      finish: "Finish",
      skip: "Skip",
      back: "Back"
    }
  }
}; 