// Shared file — coordinate with Student 2 before editing.

export type Lang = "tr" | "en";
export const DEFAULT_LANG: Lang = "tr";
export const LANG_COOKIE = "lang";

const tr = {
  nav: {
    browse: "İlanları Gör",
    myListings: "İlanlarım",
    login: "Giriş Yap",
    logout: "Çıkış Yap",
  },
  footer: {
    tagline: "Campus Lost & Found — öğrencileri eşyalarına yeniden kavuşturur.",
  },
  landing: {
    badge: "Öğrenciler için, öğrenciler tarafından",
    title: "Campus Lost & Found",
    description:
      "Kampüste bir şey mi kaybettin, yoksa sana ait olmayan bir şey mi buldun? Doğru kişiye ulaştırabilmemiz için buradan bildir.",
    browseBtn: "İlanları Gör",
    reportBtn: "Eşya Bildir",
  },
  login: {
    title: "Giriş Yap",
    description: "Email adresini gir, sana şifresiz giriş için bir magic link gönderelim.",
    backHome: "← Ana sayfaya dön",
    emailLabel: "E-posta",
    emailPlaceholder: "ornek@ornek.com",
    sentMessagePrefix: "Email kutunu kontrol et — ",
    sentMessageSuffix:
      " adresine bir magic link gönderdik. Giriş yapmayı tamamlamak için linke tıkla.",
    sendBtn: "Magic Link Gönder",
  },
  profileSetup: {
    title: "Campus Lost & Found'a Hoş Geldin",
    description:
      "Diğer öğrencilerin kiminle muhatap olduğunu bilmesi için adını girer misin.",
    emailLabel: "E-posta",
    nameLabel: "Ad Soyad",
    namePlaceholder: "Ayşe Yılmaz",
    continueBtn: "Devam Et",
    nameRequiredError: "Ad Soyad zorunludur",
  },
  report: {
    title: "Eşya Bildir",
    description: "Ne kadar çok detay verirsen, doğru kişiye ulaşması o kadar kolay olur.",
    submitLabel: "İlanı Yayınla",
  },
  editListing: {
    title: "İlanı Düzenle",
    description: "Durum değişiklikleri burada değil, İlanlarım sayfasından yapılır.",
    submitLabel: "Değişiklikleri Kaydet",
  },
  itemForm: {
    typeLegend: "Kayıp mı, Bulundu mu?",
    titleLabel: "Başlık",
    titlePlaceholder: "örn. Mavi Hydro Flask matara",
    descriptionLabel: "Açıklama",
    descriptionPlaceholder: "Renk, marka, ayırt edici işaretler…",
    categoryLabel: "Kategori",
    categoryPlaceholder: "Seç…",
    dateLabel: "Tarih",
    locationLabel: "Konum",
    locationPlaceholder: "örn. Kütüphane 2. Kat",
  },
  imageUpload: {
    label: "Eşya Görseli",
    helpTextPrefix: "JPG, JPEG veya PNG — en fazla ",
    helpTextSuffix: "MB.",
    previewAlt: "Önizleme",
  },
  validation: {
    titleRequired: "Başlık zorunludur",
    descriptionRequired: "Açıklama zorunludur",
    dateRequired: "Tarih zorunludur",
    locationRequired: "Konum zorunludur",
    imageRequired: "Görsel zorunludur",
    imageType: "Görsel JPG, JPEG veya PNG formatında olmalı",
    imageSizePrefix: "Görsel en fazla ",
    imageSizeSuffix: "MB olmalı",
  },
  itemActions: {
    fixErrors: "Lütfen aşağıdaki hataları düzelt",
    uploadFailedPrefix: "Görsel yüklenemedi: ",
    onlyOwnListings: "Sadece kendi ilanlarını düzenleyebilirsin",
    hasClaimsError: "Bu ilana claim gelmiş — silmek yerine Close Listing kullan.",
  },
  myListings: {
    title: "İlanlarım",
    reportBtn: "Eşya Bildir",
    emptyState: "Henüz hiç eşya bildirmedin.",
  },
  listingCard: {
    category: "Kategori:",
    location: "Konum:",
    date: "Tarih:",
  },
  listingActions: {
    edit: "Düzenle",
    markReturned: "İade Edildi Olarak İşaretle",
    closeListing: "İlanı Kapat",
    delete: "Sil",
    hasClaimsHint: "Claim var — silmek yerine ilanı kapat",
  },
  claims: {
    noClaims: "Henüz claim yok.",
    claimsHeadingPrefix: "Claim'ler (",
    claimsHeadingSuffix: ")",
    unknown: "Bilinmiyor",
    emailHidden: "Kabul edilene kadar email gizli",
    accept: "Kabul Et",
    reject: "Reddet",
  },
  browse: {
    title: "İlanları Gör",
    comingSoon: "Çok yakında.",
  },
  categories: {
    Electronics: "Elektronik",
    "Wallet / Money": "Cüzdan / Para",
    Keys: "Anahtar",
    Bag: "Çanta",
    Clothing: "Kıyafet",
    Books: "Kitap",
    "ID / Cards": "Kimlik / Kart",
    Accessories: "Aksesuar",
    Other: "Diğer",
  },
  itemType: {
    lost: "Kayıp",
    found: "Bulundu",
  },
  itemStatus: {
    open: "Açık",
    claimed: "Talep Edildi",
    returned: "İade Edildi",
    closed: "Kapatıldı",
  },
  claimStatus: {
    pending: "Beklemede",
    accepted: "Kabul Edildi",
    rejected: "Reddedildi",
  },
};

const en: typeof tr = {
  nav: {
    browse: "Browse Items",
    myListings: "My Listings",
    login: "Login",
    logout: "Logout",
  },
  footer: {
    tagline: "Campus Lost & Found — helping students reunite with their things.",
  },
  landing: {
    badge: "For students, by students",
    title: "Campus Lost & Found",
    description:
      "Lost something on campus, or found something that isn't yours? Report it here so we can get it back to the right person.",
    browseBtn: "Browse Items",
    reportBtn: "Report Item",
  },
  login: {
    title: "Log in",
    description: "Enter your email and we'll send you a magic link — no password needed.",
    backHome: "← Back to home",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    sentMessagePrefix: "Check your email — we sent a magic link to ",
    sentMessageSuffix: ". Click it to finish signing in.",
    sendBtn: "Send Magic Link",
  },
  profileSetup: {
    title: "Welcome to Campus Lost & Found",
    description: "Tell us your name so other students know who they're dealing with.",
    emailLabel: "Email",
    nameLabel: "Full Name",
    namePlaceholder: "Jane Doe",
    continueBtn: "Continue",
    nameRequiredError: "Full name is required",
  },
  report: {
    title: "Report an Item",
    description: "Fill in as much detail as you can — it helps the right person find it.",
    submitLabel: "Publish Listing",
  },
  editListing: {
    title: "Edit Listing",
    description: "Status changes happen from My Listings, not here.",
    submitLabel: "Save Changes",
  },
  itemForm: {
    typeLegend: "Lost or Found?",
    titleLabel: "Title",
    titlePlaceholder: "e.g. Blue Hydro Flask water bottle",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Color, brand, distinguishing marks…",
    categoryLabel: "Category",
    categoryPlaceholder: "Select…",
    dateLabel: "Date",
    locationLabel: "Location",
    locationPlaceholder: "e.g. Library 2nd Floor",
  },
  imageUpload: {
    label: "Item Image",
    helpTextPrefix: "JPG, JPEG, or PNG — max ",
    helpTextSuffix: "MB.",
    previewAlt: "Preview",
  },
  validation: {
    titleRequired: "Title is required",
    descriptionRequired: "Description is required",
    dateRequired: "Date is required",
    locationRequired: "Location is required",
    imageRequired: "Image is required",
    imageType: "Image must be a JPG, JPEG, or PNG file",
    imageSizePrefix: "Image must be ",
    imageSizeSuffix: "MB or smaller",
  },
  itemActions: {
    fixErrors: "Please fix the errors below",
    uploadFailedPrefix: "Image upload failed: ",
    onlyOwnListings: "You can only edit your own listings",
    hasClaimsError: "This listing has claims — use Close Listing instead.",
  },
  myListings: {
    title: "My Listings",
    reportBtn: "Report Item",
    emptyState: "You haven't reported any items yet.",
  },
  listingCard: {
    category: "Category:",
    location: "Location:",
    date: "Date:",
  },
  listingActions: {
    edit: "Edit",
    markReturned: "Mark as Returned",
    closeListing: "Close Listing",
    delete: "Delete",
    hasClaimsHint: "Has claims — use Close instead of Delete",
  },
  claims: {
    noClaims: "No claims yet.",
    claimsHeadingPrefix: "Claims (",
    claimsHeadingSuffix: ")",
    unknown: "Unknown",
    emailHidden: "Email hidden until accepted",
    accept: "Accept",
    reject: "Reject",
  },
  browse: {
    title: "Browse Items",
    comingSoon: "Coming soon.",
  },
  categories: {
    Electronics: "Electronics",
    "Wallet / Money": "Wallet / Money",
    Keys: "Keys",
    Bag: "Bag",
    Clothing: "Clothing",
    Books: "Books",
    "ID / Cards": "ID / Cards",
    Accessories: "Accessories",
    Other: "Other",
  },
  itemType: {
    lost: "Lost",
    found: "Found",
  },
  itemStatus: {
    open: "Open",
    claimed: "Claimed",
    returned: "Returned",
    closed: "Closed",
  },
  claimStatus: {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
  },
};

export const dictionaries = { tr, en } as const;
export type Dictionary = typeof tr;
