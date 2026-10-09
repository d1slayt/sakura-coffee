/**
 * English copy for SakuraCoffee. Every user-facing string in components comes
 * from a dictionary with this shape; adding a language means adding a file
 * that satisfies `Dictionary` (see ../index.ts), not editing components.
 *
 * `Emphasis` marks the one italic phrase in a headline.
 */

export interface Emphasis {
  before: string;
  em: string;
  after: string;
}

const en = {
  meta: {
    title: "SakuraCoffee — Espresso & pour-over bar",
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
  status: {
    openNow: "Open now",
    closedNow: "Closed now",
    until: "until",
    opensAt: "opens",
    today: "today",
    tomorrow: "tomorrow",
  },
  staticDemo: {
    badge: "Demo",
    banner: "Static portfolio demo: the menu, search and forms run in your browser, with no server.",
    link: "Full PostgreSQL version on GitHub",
    reservation:
      "This is the static demo on GitHub Pages: your details were validated but not sent. The full version stores the request in PostgreSQL and checks free seats.",
    contact:
      "This is the static demo on GitHub Pages: your message was validated but not sent. The full version stores it in the database.",
  },
  demo: {
    badge: "Demo details",
    notice: "SakuraCoffee is a concept brand. This address and these hours are placeholders.",
  },
  home: {
    hero: {
      eyebrow: "Espresso & pour-over bar",
      issue: "No. 01 — Autumn",
      title: [
        { before: "Two cherries,", em: "", after: "" },
        { before: "one ", em: "careful", after: "" },
        { before: "cup.", em: "", after: "" },
      ] satisfies Emphasis[],
      intro:
        "A coffee bean is the seed of a cherry. Sakura is the blossom of another. We're a small bar that gives both the attention they deserve: a seasonal menu, coffee brewed by hand, and somewhere quiet to drink it.",
      primaryCta: "See the menu",
      secondaryCta: "Book the brew bar",
      verticalCaption: "Kalita Wave · 93°C · 3:00",
      figure: "Fig. 01 — Filter of the week, poured to order.",
      onBarTitle: "On the bar today",
      onBar: [
        { label: "Espresso", value: "House blend, medium roast" },
        { label: "Filter", value: "A rotating single origin" },
        { label: "Kitchen", value: "Baked each morning, served until 14:00" },
      ],
    },
    story: {
      label: "02 — Story",
      quote: { before: "The coffee bean is the seed of a ", em: "cherry", after: "." } satisfies Emphasis,
      paragraphs: [
        "We named the shop after two cherries. One grows on a coffee shrub and holds the seed we roast. The other blooms for about a week each spring, and then it's gone.",
        "Both are at their best for a short moment. An espresso is best in its first minute, a croissant before eleven. Most of what we do is about catching that moment, and being honest when it has passed.",
      ],
      link: "Read our story",
      figure: "Fig. 02 — The bloom: the first thirty seconds of a pour-over.",
    },
    featured: {
      label: "03 — From the bar",
      title: { before: "A short menu, made ", em: "carefully", after: "." } satisfies Emphasis,
      intro: "A few things we'd order ourselves, and one that's waiting for spring.",
      cta: "See the full menu",
      seasonalLabel: "Out of season",
      unavailable: "Unavailable",
      empty: "The menu is being rewritten. Check back shortly.",
    },
    philosophy: {
      label: "04 — Method",
      title: { before: "Slow where it matters, ", em: "quick", after: " where it doesn't." } satisfies Emphasis,
      steps: [
        {
          title: "Source",
          meta: "Traceable lots · seasonal",
          body: "We buy green coffee by the lot, so we can tell you where a cup came from and how it was processed. The lots described on this site are concept examples.",
        },
        {
          title: "Roast",
          meta: "Rested 7–21 days",
          body: "Light to medium roasts, rested for one to three weeks before they reach the grinder. Mondays are for roasting, which is why the brew bar is closed.",
        },
        {
          title: "Brew",
          meta: "Weighed · timed · tasted",
          body: "Every recipe is weighed, timed and written on the board. If a shot runs fast, we pour it away and pull another.",
        },
        {
          title: "Serve",
          meta: "Ceramic, not paper",
          body: "Hot drinks go into warmed ceramic cups. Filter coffee comes with a small card that says what you're drinking.",
        },
      ],
      figureBeans: "Fig. 03 — Rested beans, ready for the grinder.",
      figureEspresso: "Fig. 04 — 18 g in, 36 g out, about 28 seconds.",
    },
    atmosphere: {
      label: "05 — The room",
      title: { before: "Ten seats by the window, ", em: "six", after: " at the bar." } satisfies Emphasis,
      body: "Morning light, a long wooden counter, no music before nine. Stay for one cup or three.",
      captions: {
        window: "Window bench, early",
        windowVertical: "Morning light · east window",
        table: "The round table",
        bar: "The bar before opening",
      },
      note: "Photographs are illustrative and come from Unsplash.",
    },
    visit: {
      label: "06 — Visit",
      title: { before: "Come by, ", em: "or", after: " book a seat." } satisfies Emphasis,
      hours: "Hours",
      address: "Address",
      contact: "Contact",
      cta: "Plan your visit",
    },
  },
  menu: {
    metaTitle: "Menu",
    metaDescription:
      "The full SakuraCoffee menu: espresso, hand-brewed filter, Japanese teas, pastries and a short kitchen menu, with ingredients and allergens.",
    eyebrow: "Menu",
    title: { before: "Everything we ", em: "make", after: "." } satisfies Emphasis,
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
    emptyBody: "Not even in spring. Try fewer filters or a different word.",
    ingredients: "Ingredients",
    allergens: "Allergens",
    noAllergens: "No listed allergens",
    allergenNote:
      "Allergen information on this demo menu is illustrative. In a real shop, always ask at the bar if you have an allergy.",
    unavailable: "Unavailable",
    veganOption: "Vegan with oat drink",
    loading: "Fetching the menu…",
    backToMenu: "Back to the menu",
    viewItem: "View details",
    category: "Category",
    sections: { DRINK: "Drinks", FOOD: "Food" },
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
    eyebrow: "Story",
    title: { before: "Named after ", em: "two", after: " cherries." } satisfies Emphasis,
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
    figures: {
      kettle: "Fig. 05 — A slow, even pour.",
      blossom: "Fig. 06 — The other cherry.",
    },
    licenseLink: "Unsplash License",
    cta: "See what's on the menu",
  },
  visit: {
    metaTitle: "Visit & book the brew bar",
    metaDescription:
      "Opening hours, location and contact for SakuraCoffee, plus booking for the six-seat pour-over brew bar.",
    eyebrow: "Visit",
    title: { before: "Come for a ", em: "cup", after: ", stay for a second." } satisfies Emphasis,
    hours: "Opening hours",
    today: "Today",
    address: "Address",
    contact: "Contact",
    mapNote:
      "There's no map here on purpose: this is a demo shop, and we won't send you to an address that doesn't exist.",
    booking: {
      heading: "Book the brew bar",
      intro:
        "Six seats at the pour-over counter. Sessions last 45 minutes, up to four guests per booking, Tuesday to Sunday. Walk-ins are always welcome at the main bar.",
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
    tagline: "Two cherries, one careful cup.",
    explore: "Explore",
    visit: "Visit",
    colophon: "Colophon",
    colophonBody: "Set in Literata and Manrope. Photography from Unsplash.",
    rights: "A concept brand built as a portfolio project.",
    sakura: "sakura, the cherry blossom.",
    home: "Home",
  },
  notFound: {
    metaTitle: "Page not found",
    eyebrow: "404",
    title: { before: "This page has gone the way of ", em: "last spring's", after: " blossoms." } satisfies Emphasis,
    body: "It may have moved, or it never existed. Either way, the coffee is still on.",
    home: "Back to the start",
    menu: "See the menu",
  },
  error: {
    title: "Something spilled.",
    body: "This part of the page didn't load. It's on us, not you.",
    retry: "Try again",
    dataTitle: "The menu is resting.",
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
    nameTooLong: "Please keep your name under 80 characters.",
    email: "Enter a valid email address.",
    phone: "Enter a valid phone number.",
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
