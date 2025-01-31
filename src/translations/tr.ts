export default {
  common: {
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',
    cancel: 'İptal',
    save: 'Kaydet',
    delete: 'Sil',
    edit: 'Düzenle',
    back: 'Geri',
    or: 'veya',
    notAvailable: 'Mevcut Değil',
    retry: 'Tekrar Dene',
  },
  auth: {
    signIn: 'Giriş Yap',
    signOut: 'Çıkış Yap',
    signUp: 'Kayıt Ol',
    email: 'E-posta',
    password: 'Şifre',
    confirmPassword: 'Şifreyi Onayla',
    fullName: 'Ad Soyad',
    welcomeBack: 'Tekrar Hoşgeldiniz',
    welcomeSubtitle: 'Kişiselleştirilmiş maç tahminlerinize erişmek için giriş yapın',
    createAccount: 'Hesap Oluştur',
    createAccountSubtitle: 'AI destekli maç tahminleri için bize katılın',
    noAccount: 'Hesabınız yok mu? Kayıt Olun',
    haveAccount: 'Zaten hesabınız var mı? Giriş Yapın',
    passwordsNoMatch: 'Şifreler eşleşmiyor',
    fillAllFields: 'Lütfen tüm alanları doldurun',
    signInWithGoogle: 'Google ile Giriş Yap',
    signInWithFacebook: 'Facebook ile Giriş Yap',
    continueWithGoogle: 'Google ile Devam Et',
    continueWithFacebook: 'Facebook ile Devam Et',
    signingIn: 'Giriş yapılıyor...',
  },
  navigation: {
    tabs: {
      matches: 'Maçlar',
      account: 'Hesabım',
      bulletin: 'Bülten',
    },
    titles: {
      myProfile: 'Profilim',
      matches: 'Maçlar',
      bulletin: 'Günlük Bülten',
      matchDetails: 'Maç Detayları',
      standings: 'Puan Durumu',
      analysis: 'Analiz',
    },
  },
  matches: {
    upcoming: 'Gelecek Maçlar',
    live: 'Canlı Maçlar',
    finished: 'Tamamlanan Maçlar',
    noMatches: 'Maç bulunamadı',
    matchday: 'Hafta',
    form: {
      win: 'G',
      loss: 'M',
      draw: 'B'
    },
    analysis: {
      title: 'Maç Analizi',
      subtitle: 'AI destekli öngörüler ve tahminler',
      button: 'Analiz Et',
      showDetails: 'Detayları Göster',
      hideDetails: 'Detayları Gizle',
      loadingSteps: {
        stats: 'Maç istatistikleri alınıyor...',
        performance: 'Takım performansları analiz ediliyor...',
        predictions: 'Yapay zeka tahminleri oluşturuluyor...',
        finalizing: 'Maç öngörüleri tamamlanıyor...'
      }
    },
    predictions: {
      title: 'Tahminler',
      confidence: '{{percent}}% Güven Oranı',
      types: {
        matchResult: 'Maç Sonucu',
        totalGoals: 'Toplam Gol',
        bothTeamsToScore: 'Karşılıklı Gol',
        homeTeamGoals: 'Ev Sahibi Gol',
        awayTeamGoals: 'Deplasman Gol',
        firstGoal: 'İlk Gol'
      },
      risk: {
        RISKY: 'Riskli',
        MODERATE: 'Makul',
        SAFE: 'Güvenli'
      }
    },
    headToHead: 'Karşılaştırma',
    status: {
      live: 'CANLI',
      loadingDetails: 'Maç detayları yükleniyor...',
      matchNotFound: 'Maç bulunamadı'
    },
    filter: {
      title: 'Filtrele',
      allLeagues: 'Tüm Ligler',
      allTeams: 'Tüm Takımlar',
      apply: 'Uygula',
      reset: 'Sıfırla',
      selectLeague: 'Lig Seç',
      selectTeam: 'Takım Seç',
      clearAll: 'Tümünü Temizle',
      search: 'Ara',
      noResults: 'Sonuç bulunamadı'
    }
  },
  settings: {
    title: 'Ayarlar',
    language: 'Dil',
    theme: 'Tema',
    notifications: 'Bildirimler',
    memberSince: 'Üyelik tarihi',
    accountType: {
      free: 'Ücretsiz',
      premium: 'Premium'
    },
    subscription: 'Abonelik',
  },
  stats: {
    totalAnalyses: 'Toplam Analiz',
    thisMonth: 'Bu Ay',
    mostActive: 'En Aktif',
  },
  accountManagement: {
    title: 'Hesap Yönetimi',
    deleteAccount: 'Hesabı Sil',
    deleteConfirmation: 'Bu işlem geri alınamaz. Lütfen onaylamak için şifrenizi girin.',
    continue: 'Devam Et',
    confirmPassword: 'Şifreyi Onayla',
    enterPassword: 'Hesabınızı silmek için lütfen şifrenizi girin',
    passwordRequired: 'Şifre gerekli',
    invalidPassword: 'Geçersiz şifre veya bir şeyler yanlış gitti. Lütfen tekrar deneyin.',
  },
  premium: {
    title: 'Premium',
    subscribe: 'Abone Ol',
    restore: 'Satın Alımları Geri Yükle',
    freePlan: 'Ücretsiz Plan',
    analysesRemaining: 'analiz hakkı kaldı bu ay',
    features: {
      unlimitedAnalysis: {
        title: 'Sınırsız Analiz',
        description: 'İstediğiniz maçı, istediğiniz zaman analiz edin'
      },
      detailedStats: {
        title: 'Detaylı İstatistikler',
        description: 'Gelişmiş istatistiklere erişim'
      },
      matchAlerts: {
        title: 'Maç Bildirimleri',
        description: 'Önemli maçlar için bildirim alın'
      },
      advancedAnalysis: {
        title: 'Gelişmiş Analiz',
        description: 'Tarihsel veriler ve tahminlerle detaylı AI destekli maç analizleri alın'
      },
      historicalData: {
        title: 'Geçmiş Veriler',
        description: 'Kapsamlı geçmiş maç verilerine ve takım performans metriklerine erişin'
      },
      smartAlerts: {
        title: 'Akıllı Bildirimler',
        description: 'Yüksek olasılıklı maçlar ve önemli oyun olayları için bildirimler alın'
      }
    },
    upgradeToPremium: 'Premium\'a Yükselt',
    unlockPotential: 'Match Predictor AI\'ın tüm potansiyelini açığa çıkarın',
    choosePlan: 'Planınızı Seçin',
    weekly: 'Haftalık',
    monthly: 'Aylık',
    startFreeTrial: 'Ücretsiz Denemeyi Başlat',
    processing: 'İşleniyor...',
    continue: 'Devam Et',
    restorePurchases: 'Satın Alımları Geri Yükle',
    purchaseError: 'Satın alma sırasında bir hata oluştu. Lütfen tekrar deneyin.',
    restoreError: 'Satın alımları geri yüklerken bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
    ok: 'Tamam'
  },
  standings: {
    headers: {
      position: '#',
      team: 'Takım',
      played: 'O',
      won: 'G',
      draw: 'B',
      lost: 'M',
      goalsFor: 'AG',
      goalsAgainst: 'YG',
      goalDifference: 'AV',
      points: 'P'
    },
    labels: {
      matchesPlayed: 'Oynanan Maç',
      form: 'Form',
      nextMatch: 'Sonraki Maç'
    }
  },
  tutorial: {
    bulletin: {
      title: "Günlük Maç Bülteni",
      message: "Burada günün önemli maçlarını görebilir, detaylı analizlere ulaşabilirsiniz. Her maç kartına tıklayarak detaylı bilgilere erişebilirsiniz."
    },
    match: {
      title: "Maç Detayı",
      message: "Burada maç bilgilerini görebilir, detaylı istatistikleri görebilirsiniz. Ayrıca Analiz butonuna tıklayarak maçın detaylı analizini görebilirsiniz."
    },
    buttons: {
      next: "İleri",
      finish: "Bitir",
      skip: "Geç",
      back: "Geri"
    }
  }
}; 