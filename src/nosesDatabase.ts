export interface PerfumeCreation {
  name: string;
  brand: string;
}

export interface NoseItem {
  name: string;
  category: string; // e.g. "The Historical Foundations", "The Maximalists", etc.
  blueprint: string;
  howHeWorked: string;
  experience: string;
  seminalWorksList: PerfumeCreation[];
}

export const MASTER_NOSES_DATABASE: NoseItem[] = [
  // The Historical Foundations (The Old Masters)
  {
    name: "Jacques Guerlain",
    category: "The Historical Foundations (The Old Masters)",
    blueprint: "The sweeping, multi-act opera.",
    howHeWorked: "He built perfumes like monumental oil paintings. He used a heavy, secret signature blend—the Guerlinade (a rich mix of vanilla, powdery iris, and warm tonka bean)—and smashed it against sharp, bright citrus.",
    experience: "His perfumes demand patience. They start off sharp, borderline medicinal, and completely transform over 12 hours on the skin into a deep, smoky, velvety warmth.",
    seminalWorksList: [
      { name: "Shalimar", brand: "Guerlain" },
      { name: "L'Heure Bleue", brand: "Guerlain" },
      { name: "Mitsouko", brand: "Guerlain" }
    ]
  },
  {
    name: "Edmond Roudnitska",
    category: "The Historical Foundations (The Old Masters)",
    blueprint: "The clean, architectural sketch.",
    howHeWorked: "He revolutionized perfumery by screaming \"less is more.\" Before him, perfumes were thick, heavy, and chaotic. He introduced space, air, and sharp definition by stripping down formulas and using early synthetic molecules to create the illusion of weightlessness.",
    experience: "His scents smell like a crisp morning breeze. He practically invented the smell of \"freshness\" by mastering how to make a perfume radiate through a room without being heavy or sweet.",
    seminalWorksList: [
      { name: "Diorissimo", brand: "Dior" },
      { name: "Eau Sauvage", brand: "Dior" }
    ]
  },
  {
    name: "Ernest Daltroff",
    category: "The Historical Foundations (The Old Masters)",
    blueprint: "The beautiful contradiction.",
    howHeWorked: "As the founder of Caron, he loved high-stakes friction. He took brutally dark, bitter, industrial leather bases and wrapped them around hyper-feminine, sweet, powdery flowers like carnation.",
    experience: "A constant tug-of-war on your skin. It smells simultaneously vintage and dangerous—like a clean, expensive floral soap dropped into an old-school leather jacket.",
    seminalWorksList: [
      { name: "Pour Un Homme de Caron", brand: "Caron" },
      { name: "Tabac Blond", brand: "Caron" }
    ]
  },
  {
    name: "François Coty",
    category: "The Historical Foundations (The Old Masters)",
    blueprint: "The structural godfather.",
    howHeWorked: "He was the first to realize that natural ingredients provide the soul of a perfume, but synthetic chemistry provides the skeleton. He created the master blueprint for the Chypre genre—locking a bright citrus top note onto a dark, damp, forest floor baseline (oakmoss and patchouli).",
    experience: "Earthy, sophisticated, and deeply rooted. It sets up a perfect transition from bright sunlight to a deep, dark woods profile.",
    seminalWorksList: [
      { name: "Chypre de Coty", brand: "Coty" },
      { name: "Emeraude", brand: "Coty" }
    ]
  },

  // The Maximalists (The Heavy Storytellers)
  {
    name: "Christopher Sheldrake",
    category: "The Maximalists (The Heavy Storytellers)",
    blueprint: "Baroque desert opulence.",
    howHeWorked: "Working with Serge Lutens, Sheldrake essentially invented modern dark niche perfumery. He completely threw away fresh, clean top notes. Instead, he drenched heavy woods in honey, unctuous resins, sticky spices, and dried fruits.",
    experience: "Deep, thick, and borderline suffocating in hot weather. It doesn't walk into a room; it hovers over the skin like a rich, dark, intoxicating cloud.",
    seminalWorksList: [
      { name: "Ambre Sultan", brand: "Serge Lutens" },
      { name: "Chergui", brand: "Serge Lutens" }
    ]
  },
  {
    name: "Cécile Zarokian",
    category: "The Maximalists (The Heavy Storytellers)",
    blueprint: "The high-volume amber wave.",
    howHeWorked: "She creates massive, heavy perfumes that feature incredibly high concentrations of pure oils. To stop these dense ambers and vanillas from sitting flat on the skin, she anchors them with explosive, spicy top notes like cardamom and pepper.",
    experience: "Pure power. Her perfumes create a giant, warm, spicy-sweet shield around you that refuses to wash off, projecting luxury across a room for an entire day.",
    seminalWorksList: [
      { name: "Ani", brand: "Nishane" },
      { name: "Remember Me", brand: "Jovoy" }
    ]
  },
  {
    name: "Sultan Pasha",
    category: "The Maximalists (The Heavy Storytellers)",
    blueprint: "The ancient oil revival.",
    howHeWorked: "He completely bypasses modern spray perfumery, formulating strictly in pure, ultra-concentrated oils (attars). He uses highly rare, raw ingredients—genuine deer musk, real ambergris, and precious aged sandalwood—ignoring modern corporate restrictions.",
    experience: "Intimate but eternal. Because there is no alcohol to explode the scent into the air, the perfume acts like a slow-burning fuse, heating up with your body temperature to reveal new layers over 24 hours.",
    seminalWorksList: [
      { name: "Aurum d'Angkhor", brand: "Sultan Pasha Attars" },
      { name: "Theiris", brand: "Sultan Pasha Attars" }
    ]
  },
  {
    name: "Prin Lomros",
    category: "The Maximalists (The Heavy Storytellers)",
    blueprint: "Cinematic, jagged atmospheric art.",
    howHeWorked: "This Thai perfumer treats scent like a dark movie. He completely avoids making perfumes smell \"pretty\" or mass-appealing. Instead, he relies on smoke, ash, damp earth, bonfire notes, and heavy animalics to recreate ancient temple rituals or wild environments.",
    experience: "Highly polarizing and raw. It smells like a ancient bonfire in a swamp; it's rugged, unpolished, and hyper-realistic.",
    seminalWorksList: [
      { name: "Ma Nishtana", brand: "Prissana" },
      { name: "Tyrannosaurus Rex", brand: "Zoologist" }
    ]
  },
  {
    name: "Antonio Gardoni",
    category: "The Maximalists (The Heavy Storytellers)",
    blueprint: "Vintage walls of sound.",
    howHeWorked: "An architect by trade, he builds towering, dense structures of scent. His signature trick is taking an incredibly clean, sharp, old-school distilled lavender oil and slamming it directly into a thick, buzzing, borderline dirty base of resins and animal musks.",
    experience: "A shock to the system. The opening is loud, bitter, and aggressive, but it slowly melts over an hour into an incredibly rich, comforting, vintage golden aura.",
    seminalWorksList: [
      { name: "Maai", brand: "Bogue Profumo" }
    ]
  },

  // The Minimalists (The Watercolor Poets)
  {
    name: "Jean-Claude Ellena",
    category: "The Minimalists (The Watercolor Poets)",
    blueprint: "The Japanese haiku.",
    howHeWorked: "Ellena stripped his workspace down to fewer than 40 raw ingredients, completely throwing out heavy resins and sweet notes. He uses spacious synthetic backbones (like Iso E Super) to give individual natural ingredients an incredible amount of room to breathe.",
    experience: "Weightless, transparent, and radiant. His perfumes don't coat the skin; they float around you like a clean, woody-citrus aura. You might stop smelling it on yourself, but everyone around you catches a subtle trail.",
    seminalWorksList: [
      { name: "Terre d'Hermès", brand: "Hermès" },
      { name: "Jardin en Méditerranée", brand: "Hermès" }
    ]
  },
  {
    name: "Olivia Giacobetti",
    category: "The Minimalists (The Watercolor Poets)",
    blueprint: "The fleeting, translucent snapshot.",
    howHeWorked: "She treats perfume like light passing through water. She is a genius at capturing highly specific, fragile environmental moments—like a damp fig leaf crushing in your hand or wet linen drying in a spring breeze.",
    experience: "Incredibly delicate, clean, and poetic. Her perfumes completely avoid heavy basenotes, meaning they don't last for days, but they capture a hyper-realistic, refreshing moment in time perfectly.",
    seminalWorksList: [
      { name: "Philosykos", brand: "Diptyque" },
      { name: "Premier Figuier", brand: "L'Artisan Parfumeur" }
    ]
  },
  {
    name: "Christine Nagel",
    category: "The Minimalists (The Watercolor Poets)",
    blueprint: "Tactile, physical textures.",
    howHeWorked: "Taking over at Hermès after Ellena, Nagel kept his minimalist blueprint but changed the feel. Instead of weightless watercolors, she creates perfumes that feel like physical fabrics—rough silk, cold metal, or damp suede.",
    experience: "Sharp, modern, and distinct. Her work uses unusual synthetic angles that feel incredibly tailored and structural, like walking through a high-end designer boutique.",
    seminalWorksList: [
      { name: "H24", brand: "Hermès" },
      { name: "Wood Sage & Sea Salt", brand: "Jo Malone" }
    ]
  },

  // The Concept Creators (The Subversives)
  {
    name: "Bertrand Duchaufour",
    category: "The Concept Creators (The Subversives)",
    blueprint: "Travel-inspired light and dark.",
    howHeWorked: "He loves pairing completely opposite textures together. His classic signature move is taking a bone-dry, freezing, metallic temple incense note and dropping it into a warm, damp, rooty network of earth and wild vetiver grass.",
    experience: "Highly intellectual and atmospheric. His perfumes don't smell like a person trying to smell nice; they smell like a physical destination or an ancient sacred geography.",
    seminalWorksList: [
      { name: "Timbuktu", brand: "L'Artisan Parfumeur" },
      { name: "Dzongkha", brand: "L'Artisan Parfumeur" }
    ]
  },
  {
    name: "Geza Schoen",
    category: "The Concept Creators (The Subversives)",
    blueprint: "The radical minimalist prankster.",
    howHeWorked: "He completely pulled back the curtain on the luxury perfume industry. With his Molecule project, he took single, high-tech aroma-chemicals (like Iso E Super) and bottled them raw in alcohol with zero other ingredients.",
    experience: "A vanishing act. Out of the bottle, it smells like almost nothing. But when it hits your skin heat, it creates a subtle, woody, pheromonal magnetism that people around you will notice even if you can't smell it yourself.",
    seminalWorksList: [
      { name: "Molecule 01", brand: "Escentric Molecules" },
      { name: "Escentric 01", brand: "Escentric Molecules" }
    ]
  },
  {
    name: "Alessandro Gualtieri",
    category: "The Concept Creators (The Subversives)",
    blueprint: "Primal, chaotic energy.",
    howHeWorked: "Known as \"The Crazy Nose,\" he refuses to release his list of ingredients to stop people from over-analyzing his work. He uses massive, industrial-strength overdoses of heavy woods, metals, and deep musk to trigger a raw, visceral response.",
    experience: "Extremely loud, aggressive, and nearly indestructible. Formulations like Megamare are legendary for clinging to skin and clothes for days, refusing to be scrubbed off.",
    seminalWorksList: [
      { name: "Black Afgano", brand: "Nasomatto" },
      { name: "Megamare", brand: "Orto Parisi" }
    ]
  },
  {
    name: "Quentin Bisch",
    category: "The Concept Creators (The Subversives)",
    blueprint: "High-definition sci-fi radiance.",
    howHeWorked: "He uses cutting-edge, high-tech synthetic biotech molecules to create surreal, polished versions of classic notes like wood, rose, and leather, stripping out all the muddy or heavy facets of traditional natural oils.",
    experience: "Hyper-modern, glossy, and incredibly loud. His perfumes project an ultra-clean, computerized wood or mineral trail that commands attention across vast distances and lasts for days.",
    seminalWorksList: [
      { name: "Bois Impérial", brand: "Essential Parfums" },
      { name: "Ganymede", brand: "Marc-Antoine Barrois" }
    ]
  },

  // The Technical Virtuosos (The Master Engineers)
  {
    name: "Dominique Ropion",
    category: "The Technical Virtuosos (The Master Engineers)",
    blueprint: "Mathematical perfection via extreme overdose.",
    howHeWorked: "He is the most technically flawless perfumer alive. He will take an absurdly massive, volatile quantity of a natural flower (like a huge dose of Turkish rose) that should ruin a perfume, and then builds a flawless, mathematical scaffold of patchouli and clean amber beneath it to hold it in perfect balance.",
    experience: "Tectonic and symphonic. Ropion perfumes do not do subtle; they are massive, perfectly engineered force fields of elegant, high-end luxury.",
    seminalWorksList: [
      { name: "Portrait of a Lady", brand: "Frédéric Malle" },
      { name: "Carnal Flower", brand: "Frédéric Malle" }
    ]
  },
  {
    name: "Francis Kurkdjian",
    category: "The Technical Virtuosos (The Master Engineers)",
    blueprint: "Crystalline, airy sweetness.",
    howHeWorked: "He is a master at creating perfectly smooth, translucent, and glowing luxury signatures. He takes heavy, sweet gourmand notes (like spun sugar) and pairs them with deep ambers, using clean, airy molecules to make the sweetness float instead of sitting thick and heavy.",
    experience: "A see-through, radiant candy cloud. It floats effortlessly through the air, smelling incredibly clean, expensive, and addictive.",
    seminalWorksList: [
      { name: "Baccarat Rouge 540", brand: "Maison Francis Kurkdjian" },
      { name: "Le Male", brand: "Jean Paul Gaultier" }
    ]
  },
  {
    name: "Alberto Morillas",
    category: "The Technical Virtuosos (The Master Engineers)",
    blueprint: "The king of crisp fresh air.",
    howHeWorked: "The most prolific designer perfumer in history. Morillas practically invented the modern \"aquatic\" and \"fresh\" categories by using high-tech synthetic musks and clean marine molecules to replicate the smell of running water, frozen air, and clean laundry.",
    experience: "Flawlessly clean, refreshing, and universally appealing. It mimics the sensation of stepping straight out of a luxury shower into crisp mountain air.",
    seminalWorksList: [
      { name: "Acqua di Giò", brand: "Giorgio Armani" },
      { name: "CK One", brand: "Calvin Klein" }
    ]
  },
  {
    name: "Jacques Cavallier-Belletrud",
    category: "The Technical Virtuosos (The Master Engineers)",
    blueprint: "Hyper-luxurious natural realism.",
    howHeWorked: "The true pioneer of the original 90s aquatic movement. Now working as the exclusive nose for Louis Vuitton, he utilizes cutting-edge gas extraction technology (using cold, pressurized CO2) to make natural flowers smell exactly like they do alive in the field, framing them inside high-grade ambers.",
    experience: "Flawless luxury elegance. The ingredients smell incredibly realistic, bright, and polished, avoiding any vintage powderiness or synthetic harshness.",
    seminalWorksList: [
      { name: "L'Eau d'Issey", brand: "Issey Miyake" },
      { name: "Ombre Nomade", brand: "Louis Vuitton" }
    ]
  },
  {
    name: "Olivier Polge",
    category: "The Technical Virtuosos (The Master Engineers)",
    blueprint: "Abstract, tailored French grooming.",
    howHeWorked: "As the house perfumer for Chanel, he guards the brand's historic identity. He completely avoids modern sugar or heavy wood trends, relying instead on a precise matrix of creamy, high-end Orris root (iris) and crisp, waxy, soap-clean aldehydes.",
    experience: "Abstract, impeccably groomed, and sophisticated. It doesn't smell like a specific food or flower; it smells like a high-end tailored suit, clean soap, and old-money elegance.",
    seminalWorksList: [
      { name: "Bleu de Chanel Parfum", brand: "Chanel" },
      { name: "Misia", brand: "Chanel" }
    ]
  },
  {
    name: "Olivier Cresp",
    category: "The Technical Virtuosos (The Master Engineers)",
    blueprint: "The sophisticated dessert.",
    howHeWorked: "Cresp single-handedly changed global perfumery in 1992 by creating Angel, inventing the \"gourmand\" (edible) category. His genius is taking hyper-realistic sweet notes—like cotton candy, chocolate, or lemon tarts—and locking them down with thick, bitter, earthy patchouli to stop them from being cloying.",
    experience: "Delicious but sharp. It smells undeniably mouth-watering, but it maintains an edgy, dark contrast that keeps it from smelling like a cheap body spray.",
    seminalWorksList: [
      { name: "Angel", brand: "Thierry Mugler" },
      { name: "Light Blue", brand: "Dolce & Gabbana" }
    ]
  },
  {
    name: "Sophia Grojsman",
    category: "The Technical Virtuosos (The Master Engineers)",
    blueprint: "The monolithic, permanent embrace.",
    howHeWorked: "She completely smashed the traditional perfume pyramid (where top notes fade into mid notes, then base notes). Instead, she invented a monolithic structure where a massive, identical core accord of wood, violet, clean musk, and rose runs completely unchanged from the first spray to the end of the day.",
    experience: "A giant, velvety, unchanging hug. Her perfumes do not shift or transform over time; they wrap you in a massive, linear, comforting cloud of soft peach and rose that smells identical for 16 hours.",
    seminalWorksList: [
      { name: "Trésor", brand: "Lancôme" },
      { name: "Eternity", brand: "Calvin Klein" }
    ]
  },
  {
    name: "Carlos Benaïm",
    category: "The Technical Virtuosos (The Master Engineers)",
    blueprint: "The ultimate gentlemen's trail.",
    howHeWorked: "He perfected the classic, clean American masculine style. He takes fresh, sharp, barbershop openings (like crisp lavender and green pine needles) and embeds them into smooth, comforting woods and coumarin.",
    experience: "Exceptionally groomed, reliable, and professional. His work completely avoids raw, weird, or dirty experimental notes, delivering a smooth, reassuring scent that smells like old-money country clubs and crisp white shirts.",
    seminalWorksList: [
      { name: "Polo Green", brand: "Ralph Lauren" },
      { name: "Polo Blue", brand: "Ralph Lauren" }
    ]
  },
  {
    name: "Dominique Moellhausen",
    category: "The Technical Virtuosos (The Master Engineers)",
    blueprint: "The modern global crossover.",
    howHeWorked: "She represents the new wave of niche creators, bridge-building between the East and the West. She takes incredibly heavy, dark, traditional Middle Eastern raw materials—like deep, unrefined Oud and thick balms—and polishes them with bright, hyper-diffusive Western ambers and modern sweet accents.",
    experience: "High-performance, bold, and energetic. It features the massive power and depth of ancient heavy ingredients, but strips away any old-fashioned, powdery weight, giving it a sleek, sharp, modern corporate edge.",
    seminalWorksList: [
      { name: "Not a Blue Bottle 1.4", brand: "Histoires de Parfums" }
    ]
  }
];
