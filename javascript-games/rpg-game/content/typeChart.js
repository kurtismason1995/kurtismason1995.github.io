export const TYPE_CHART = {
  stone: {
    fly: 1.5,
    water: 0.7,
  },
  fly: {
    shadow: 1.5,
    stone: 0.7,
  },
  fire: {
    nature: 1.5,
    water: 0.7,
  },
  water: {
    fire: 1.5,
    shadow: 0.7,
  },
  shadow: {
    stone: 1.5,
    nature: 0.7,
  },
  nature: {
    water: 1.5,
    fire: 0.7,
  },
};

export function getTypeMultiplier(attackType, targetType) {
  if (!attackType || !targetType) {
    return 1;
  }

  return TYPE_CHART[attackType]?.[targetType] ?? 1;
}
