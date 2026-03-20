export type StateEntry = {
  slug: string;
  name: string;
  region: string;
  type: "state" | "administrative-area";
  description: string;
  mapImage: string;
  census: {
    population?: string;
    counties?: string;
    capital?: string;
  };
};

export const statesData: StateEntry[] = [
  {
    slug: "abyei-administrative-area",
    name: "Abyei Administrative Area",
    region: "Greater Bahr el Ghazal",
    type: "administrative-area",
    description:
      "Abyei Administrative Area is a special administrative area with distinct territorial and governance significance.",
    mapImage: "/images/states/abyei-administrative-area.jpg",
    census: {
      population: "To be added",
      counties: "To be added",
      capital: "Abyei",
    },
  },
  {
    slug: "lakes",
    name: "Lakes",
    region: "Greater Bahr el Ghazal",
    type: "state",
    description:
      "Lakes is one of the states of South Sudan and forms part of the Greater Bahr el Ghazal region.",
    mapImage: "/images/states/lakes.jpg",
    census: {
      population: "To be added",
      counties: "To be added",
      capital: "Rumbek",
    },
  },
  {
    slug: "northern-bahr-el-ghazal",
    name: "Northern Bahr el Ghazal",
    region: "Greater Bahr el Ghazal",
    type: "state",
    description:
      "Northern Bahr el Ghazal is a state in the Greater Bahr el Ghazal region of South Sudan.",
    mapImage: "/images/states/northern-bahr-el-ghazal.jpg",
    census: {
      population: "To be added",
      counties: "To be added",
      capital: "Aweil",
    },
  },
  {
    slug: "warrap",
    name: "Warrap",
    region: "Greater Bahr el Ghazal",
    type: "state",
    description:
      "Warrap is a state in South Sudan and forms part of the Greater Bahr el Ghazal region.",
    mapImage: "/images/states/warrap.jpg",
    census: {
      population: "To be added",
      counties: "To be added",
      capital: "Kuajok",
    },
  },
  {
    slug: "western-bahr-el-ghazal",
    name: "Western Bahr el Ghazal",
    region: "Greater Bahr el Ghazal",
    type: "state",
    description:
      "Western Bahr el Ghazal is a state in South Sudan with Wau as its capital.",
    mapImage: "/images/states/western-bahr-el-ghazal.jpg",
    census: {
      population: "To be added",
      counties: "To be added",
      capital: "Wau",
    },
  },
  {
    slug: "central-equatoria",
    name: "Central Equatoria",
    region: "Greater Equatoria",
    type: "state",
    description:
      "Central Equatoria is a state in South Sudan and includes the national capital, Juba.",
    mapImage: "/images/states/central-equatoria.jpg",
    census: {
      population: "To be added",
      counties: "To be added",
      capital: "Juba",
    },
  },
  {
    slug: "eastern-equatoria",
    name: "Eastern Equatoria",
    region: "Greater Equatoria",
    type: "state",
    description:
      "Eastern Equatoria is a state in South Sudan and forms part of the Greater Equatoria region.",
    mapImage: "/images/states/eastern-equatoria.jpg",
    census: {
      population: "To be added",
      counties: "To be added",
      capital: "Torit",
    },
  },
  {
    slug: "western-equatoria",
    name: "Western Equatoria",
    region: "Greater Equatoria",
    type: "state",
    description:
      "Western Equatoria is a state in South Sudan and part of the Greater Equatoria region.",
    mapImage: "/images/states/western-equatoria.jpg",
    census: {
      population: "To be added",
      counties: "To be added",
      capital: "Yambio",
    },
  },
  {
    slug: "jonglei",
    name: "Jonglei",
    region: "Greater Upper Nile",
    type: "state",
    description:
      "Jonglei is one of the largest states in South Sudan and belongs to the Greater Upper Nile region.",
    mapImage: "/images/states/jonglei.jpg",
    census: {
      population: "To be added",
      counties: "To be added",
      capital: "Bor",
    },
  },
  {
    slug: "unity",
    name: "Unity",
    region: "Greater Upper Nile",
    type: "state",
    description:
      "Unity is a state in South Sudan and part of the Greater Upper Nile region.",
    mapImage: "/images/states/unity.jpg",
    census: {
      population: "To be added",
      counties: "To be added",
      capital: "Bentiu",
    },
  },
  {
    slug: "upper-nile",
    name: "Upper Nile",
    region: "Greater Upper Nile",
    type: "state",
    description:
      "Upper Nile is a state in South Sudan and a core part of the Greater Upper Nile region.",
    mapImage: "/images/states/upper-nile.jpg",
    census: {
      population: "To be added",
      counties: "To be added",
      capital: "Malakal",
    },
  },
  {
    slug: "greater-pibor-administrative-area",
    name: "Greater Pibor Administrative Area",
    region: "Greater Upper Nile",
    type: "administrative-area",
    description:
      "Greater Pibor Administrative Area is a special administrative area in South Sudan.",
    mapImage: "/images/states/greater-pibor-administrative-area.jpg",
    census: {
      population: "To be added",
      counties: "To be added",
      capital: "Pibor",
    },
  },
  {
    slug: "ruweng-administrative-area",
    name: "Ruweng Administrative Area",
    region: "Greater Upper Nile",
    type: "administrative-area",
    description:
      "Ruweng Administrative Area is a special administrative area in South Sudan.",
    mapImage: "/images/states/ruweng-administrative-area.jpg",
    census: {
      population: "To be added",
      counties: "To be added",
      capital: "Panrieng",
    },
  },
];

export function getStateBySlug(slug: string) {
  return statesData.find((item) => item.slug === slug);
}