/**
 * English copy for SakuraCoffee. Every user-facing string in components comes
 * from a dictionary with this shape; adding a language means adding a file
 * that satisfies `Dictionary` (see ../index.ts), not editing components.
 */

const en = {
  meta: {
    title: "SakuraCoffee — coffee shop: espresso, filter, Japanese tea",
    description:
      "A small espresso and pour-over bar with a seasonal menu, Japanese teas and pastries baked each morning. A concept brand.",
  },
  a11y: {
    skipToContent: "Skip to content",
    mainNavigation: "Main",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    footerNavigation: "Footer",
  },
  nav: {
    home: "SakuraCoffee home",
    cta: "Book the brew bar",
    ctaShort: "Book",
    items: { menu: "Menu", story: "Story", visit: "Visit" },
  },
  hours: {
    weekdays: "Monday – Friday",
    weekend: "Saturday & Sunday",
  },
  hoursShort: {
    weekdays: "Mon–Fri",
    weekend: "Sat–Sun",
  },
  status: {
    openNow: "Open now",
    closedNow: "Closed now",
    until: "until",
    opensAt: "opens",
    today: "today",
    tomorrow: "tomorrow",
  },
  staticDemo: {



    reservation:
      "This is the static demo on GitHub Pages: your details were validated but not sent. The full version stores the request in PostgreSQL and checks free seats.",
    contact:
      "This is the static demo on GitHub Pages: your message was validated but not sent. The full version stores it in the database.",
  },
  demo: {
    notice: "SakuraCoffee is a concept brand. This address and these hours are placeholders.",
  },
  home: {
    hero: {
      kicker: "SakuraCoffee coffee shop",
      title: "Espresso, filter coffee and Japanese tea",
      intro:
        "A small coffee shop: an espresso bar, a brew bar where filter coffee is made in front of you, and pastries in the morning, until they run out.",
      primaryCta: "See the menu",
    },
    menu: {
      title: "On the menu now",
      note: "Oat drink costs nothing extra. Ingredients and allergens are on the full menu.",
      cta: "Full menu",
      unavailable: "Unavailable",
      empty: "The menu is being rewritten. Check back shortly.",
    },
    room: {
      title: "The room and the bar",
      body: "A long wooden counter, a bench under the window and a separate brew bar where filter coffee is made while you watch.",
      name: "Why SakuraCoffee: a coffee bean is the seed of the coffee cherry, and sakura is the blossom of another cherry.",
      facts: [
        { term: "By the window", description: "10 seats, no booking" },
        { term: "Brew bar", description: "6 seats, bookable 9:00–19:45" },
        { term: "Music", description: "None before 9 am" },
        { term: "Cups", description: "Hot drinks in ceramic; takeaway on request" },
        { term: "Mondays", description: "Roasting day, the brew bar is closed" },
      ],
      link: "More about the shop",
      photoNote: "Photographs are illustrative and come from Unsplash.",
    },
    visit: {
      title: "Opening hours",
      address: "Address",
      contact: "Email",
      cta: "Getting here",
    },
  },
  menu: {
    metaTitle: "Menu",
    metaDescription:
      "The full SakuraCoffee menu: espresso, hand-brewed filter, Japanese teas, pastries and a short kitchen menu, with ingredients and allergens.",
    title: "Menu",
    intro: "Ingredients and allergens for every item. Oat drink costs nothing extra.",
    searchLabel: "Search the menu",
    searchPlaceholder: "Search drinks, food or ingredients",
    categoryLabel: "Category",
    allCategories: "All",
    filtersLabel: "Filters",
    filters: {
      vegan: "Vegan",
      vegetarian: "Vegetarian",
      gluten: "No gluten",
      milk: "No milk",
      nuts: "No nuts",
      available: "Available today",
    },
    clear: "Clear filters",
    results: (n: number) => `${n} item${n === 1 ? "" : "s"}`,
    emptyTitle: "Nothing matches that.",
    emptyBody: "Try fewer filters or a different word.",
    ingredients: "Ingredients",
    allergens: "Allergens",
    noAllergens: "No listed allergens",
    allergenNote:
      "Allergen information on this demo menu is illustrative. In a real shop, always ask at the bar if you have an allergy.",
    unavailable: "Unavailable",
    veganOption: "Vegan with oat drink",
    loading: "Fetching the menu…",
    backToMenu: "Back to the menu",
    dietaryLabel: "Dietary",
  },
  allergens: {
    GLUTEN: "Gluten",
    MILK: "Milk",
    EGGS: "Eggs",
    NUTS: "Tree nuts",
    PEANUTS: "Peanuts",
    SOY: "Soy",
    SESAME: "Sesame",
    SULPHITES: "Sulphites",
  },
  dietary: {
    VEGAN: "Vegan",
    VEGETARIAN: "Vegetarian",
    VEGAN_OPTION: "Vegan option",
  },
  about: {
    metaTitle: "Our story",
    metaDescription:
      "Why a coffee bar is named after a cherry blossom, and what SakuraCoffee pays attention to: sourcing, roasting, water, ceramics and the seasons.",
    title: "Named after two cherries.",
    lede: "The coffee bean is the seed of a fruit called the coffee cherry. Sakura is the cherry blossom. We liked the coincidence, and then we noticed what the two have in common.",
    sections: [
      {
        heading: "A short moment",
        body: [
          "Cherry blossoms last about a week. People in Japan plan picnics around them, and when they fall, nobody pretends otherwise. That's the attitude we wanted behind the bar.",
          "Coffee works the same way. Crema fades within a minute. A filter changes as it cools, often for the better. Pastries are best on the morning they're baked. So we make things to order, in small batches, and we tell you when something is out of season instead of serving a lesser version.",
        ],
      },
      {
        heading: "Seasons, not specials",
        body: [
          "The menu changes four times a year. In spring we make a latte with salted cherry blossom syrup. In autumn, roasted hojicha comes back. Seasonal drinks stay on the menu when they're out of season, marked as such, because a menu should tell the truth about what we can make today.",
        ],
      },
    ],
    details: {
      heading: "What we pay attention to",
      items: [
        { term: "Water", description: "Filtered and remineralised for brewing, so coffee tastes of coffee." },
        { term: "Temperature", description: "93°C for filter, milk no hotter than 60°C." },
        { term: "Rest", description: "Coffee rests one to three weeks after roasting before we brew it." },
        { term: "Ceramics", description: "Hot drinks in warmed ceramic cups; takeaway only when you ask." },
        { term: "Pace", description: "A pour-over takes four minutes. We'd rather you wait than rush it." },
      ],
    },
    room: {
      heading: "The room",
      body: "A long wooden counter, a bench under the window and a six-seat brew bar where you can watch every cup being made. No music before nine.",
    },
    project: {
      heading: "About this project",
      body: [
        "SakuraCoffee is a concept brand designed and built as a developer portfolio project. The shop, its address, opening hours, coffee lots and booking system are demonstrations: bookings and messages are stored in a real database, but nobody will reply to them.",
        "Photographs are from Unsplash, used under the Unsplash License. They are illustrative and don't show a real SakuraCoffee location.",
      ],
    },
    licenseLink: "Unsplash License",
    cta: "See what's on the menu",
  },
  visit: {
    metaTitle: "Visit & book the brew bar",
    metaDescription:
      "Opening hours, location and contact for SakuraCoffee, plus booking for the six-seat pour-over brew bar.",
    title: "Getting here",
    hours: "Opening hours",
    today: "Today",
    address: "Address",
    contact: "Contact",
    mapNote:
      "There's no map here on purpose: this is a demo shop, and we won't send you to an address that doesn't exist.",
    booking: {
      heading: "Book the brew bar",
      intro:
        "Six seats at the pour-over counter. Sessions start every hour from 9:00 to 19:00 and last 45 minutes, up to four guests per booking, Tuesday to Sunday. Walk-ins are always welcome at the main bar.",
      date: "Date",
      time: "Session",
      timeHint: "Choose a date to see free seats.",
      // Plain strings (not functions) so they can be passed to Client Components.
      seatsFull: "Full",
      seatsOne: "1 seat left",
      seatsMany: "{n} seats left",
      sessionLength: "{n} min",
      partySize: "Guests",
      name: "Name",
      email: "Email",
      phone: "Phone (optional)",
      note: "Anything we should know? (optional)",
      submit: "Request booking",
      submitting: "Sending…",
      successTitle: "Request received",
      reference: "Reference",
      demoSuccess:
        "This is a demo: your request is stored with the status \"pending\", but no confirmation email is sent.",
      another: "Make another booking",
      loadingSlots: "Checking seats…",
      slotsError: "We couldn't load free seats. You can still send a request.",
    },
    contactForm: {
      heading: "Write to us",
      intro: "Questions, private events, wholesale. Messages are stored in the database; in this demo nobody reads them.",
      name: "Name",
      email: "Email",
      topic: "Topic",
      message: "Message",
      submit: "Send message",
      submitting: "Sending…",
      successTitle: "Message saved",
      another: "Write another message",
    },
    required: "required",
  },
  footer: {
    rights: "A concept brand built as a portfolio project.",
    copyright: "© 2026 d1slayt. All rights reserved. Design and code may not be reused without permission.",
  },
  notFound: {
    metaTitle: "Page not found",
    eyebrow: "Error 404",
    title: "There's no such page.",
    body: "The link may be out of date. The menu and opening hours are where they always are.",
    home: "Back to the start",
    menu: "See the menu",
  },
  error: {
    title: "The page didn't load.",
    body: "Something went wrong on our side. Please try again.",
    retry: "Try again",
    dataTitle: "The menu didn't load.",
    dataBody: "We couldn't reach the menu just now. Please try again in a moment.",
  },
  contactTopics: {
    GENERAL: "General question",
    EVENTS: "Private event",
    WHOLESALE: "Wholesale",
    PRESS: "Press",
  },
  /** Server-side validation messages (Zod). */
  validation: {
    name: "Please tell us your name.",
    nameTooLong: "Please keep your name under 60 characters.",
    nameChars: "Names can contain letters, spaces, hyphens and apostrophes — no digits or links.",
    email: "Enter a valid email address.",
    emailReserved: "Mail to this address can't be delivered. Please use a real one.",
    emailDisposable: "Disposable addresses aren't accepted — please use your usual email.",
    emailTypo: (suggestion: string) => `This looks like a typo. Did you mean ${suggestion}?`,
    phone: "Enter a phone number like +7 900 123-45-67.",
    noLinks: "No links, please — describe it in words.",
    noMarkup: "No HTML needed — plain text, please.",
    gibberish: "This looks like random characters. Please write in plain words.",
    date: "Choose a valid date.",
    time: "Choose one of the listed session times.",
    partySize: "Choose how many seats you need.",
    partyMin: "At least 1 guest.",
    partyMax: "The brew bar seats up to 4 per booking.",
    noteTooLong: "Please keep this under 500 characters.",
    topic: "Choose a topic.",
    messageShort: "A little more detail, please (at least 10 characters).",
    messageLong: "Please keep your message under 2000 characters.",
  },
  bookingRules: {
    TOO_SOON: "Bookings open from tomorrow. For today, just walk in.",
    TOO_FAR: "We take bookings up to 30 days ahead.",
    CLOSED_DAY: "The brew bar is closed on Mondays while we roast.",
  },
  /** Messages returned by Server Actions. */
  forms: {
    checkFields: "Please check the highlighted fields.",
    bookingUnavailable: "We couldn't reach our booking system just now. Please try again in a few minutes.",
    unexpected: "Something went wrong on our side. Please try again.",
    tooMany: "Too many attempts from this connection. Please try again later.",
    botReservation: "Thanks — your request was received.",
    botContact: "Thanks — your message is with us.",
    reservationReceived: (partySize: number, time: string, date: string) =>
      `Request received: ${partySize} ${partySize === 1 ? "guest" : "guests"} at ${time} on ${date}.`,
    seatsLeftAt: (n: number, time: string) => `Only ${n} seat${n === 1 ? "" : "s"} left at ${time}.`,
    sessionFull: (time: string) => `The ${time} session is full. Please pick another time.`,
    notEnoughSeats: "Not enough seats left for this session.",
    duplicate: "You already have a booking for this session.",
    busy: "That session is busy right now — please try again.",
    contactSavedDemo: "Thanks — your message was saved. This is a demo shop, so nobody will reply.",
    contactSaved: "Thanks — your message is with us. We reply within two working days.",
    contactUnavailable: "We couldn't save your message just now. Please try again in a few minutes.",
  },
};

export default en;
export type Dictionary = typeof en;
