export interface SamplePreset {
  id: string;
  classId: number;
  label: string;
  iconName: string;
  description: string;
  pixels: number[];
}

// Generate procedural 28x28 grayscale sample matrices for all 10 Fashion-MNIST classes
function createPattern(drawFn: (x: number, y: number) => number): number[] {
  const pixels = new Array(784).fill(0);
  for (let y = 0; y < 28; y++) {
    for (let x = 0; x < 28; x++) {
      const val = drawFn(x, y);
      pixels[y * 28 + x] = Math.min(255, Math.max(0, Math.round(val)));
    }
  }
  return pixels;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: "tshirt",
    classId: 0,
    label: "T-shirt/top",
    iconName: "Shirt",
    description: "Short sleeve top with rounded neck collar",
    pixels: createPattern((x, y) => {
      // Body (cols 7..20, rows 9..24)
      if (y >= 9 && y <= 24 && x >= 7 && x <= 20) {
        if (y === 9 && x >= 11 && x <= 16) return 0; // Neck cut out
        return 230;
      }
      // Sleeves
      if (y >= 9 && y <= 14) {
        if (x >= 3 && x <= 7) return 210; // Left sleeve
        if (x >= 20 && x <= 24) return 210; // Right sleeve
      }
      return 0;
    }),
  },
  {
    id: "trouser",
    classId: 1,
    label: "Trouser",
    iconName: "Scissors",
    description: "Slim fit denim jeans/pants with twin leg columns",
    pixels: createPattern((x, y) => {
      // Waist (rows 4..7, cols 9..18)
      if (y >= 4 && y <= 7 && x >= 9 && x <= 18) return 240;
      // Crotch split down legs (rows 8..25)
      if (y >= 8 && y <= 25) {
        if (x >= 9 && x <= 12) return 235; // Left leg
        if (x >= 15 && x <= 18) return 235; // Right leg
      }
      return 0;
    }),
  },
  {
    id: "pullover",
    classId: 2,
    label: "Pullover",
    iconName: "Layers",
    description: "Long-sleeve knit sweater with ribbed cuffs",
    pixels: createPattern((x, y) => {
      // Full torso & long sleeves
      if (y >= 7 && y <= 24) {
        if (x >= 4 && x <= 23) {
          if (y < 10 && (x >= 12 && x <= 15)) return 0; // Crew neck
          return 220;
        }
      }
      return 0;
    }),
  },
  {
    id: "dress",
    classId: 3,
    label: "Dress",
    iconName: "Sparkles",
    description: "Sleeveless flared evening dress with waist cinch",
    pixels: createPattern((x, y) => {
      // Top straps
      if (y >= 4 && y <= 8) {
        if ((x >= 9 && x <= 11) || (x >= 16 && x <= 18)) return 220;
      }
      // Bodice (rows 8..14)
      if (y >= 8 && y <= 14 && x >= 9 && x <= 18) return 230;
      // Flared A-line skirt (rows 15..26)
      if (y >= 15 && y <= 26) {
        const spread = Math.floor((y - 15) * 0.5);
        if (x >= 9 - spread && x <= 18 + spread) return 240;
      }
      return 0;
    }),
  },
  {
    id: "coat",
    classId: 4,
    label: "Coat",
    iconName: "Shield",
    description: "Double-breasted long outer jacket with lapels",
    pixels: createPattern((x, y) => {
      if (y >= 5 && y <= 25 && x >= 4 && x <= 23) {
        // Lapels gap in top center V
        if (y >= 5 && y <= 11 && x >= 12 - (y - 5) && x <= 15 + (y - 5)) return 40;
        return 225;
      }
      return 0;
    }),
  },
  {
    id: "sandal",
    classId: 5,
    label: "Sandal",
    iconName: "Footprints",
    description: "Open-toe footwear with thin straps and heel base",
    pixels: createPattern((x, y) => {
      // Sole base (rows 21..24, cols 5..22)
      if (y >= 21 && y <= 24 && x >= 5 && x <= 22) return 240;
      // Ankle strap & front strap
      if (y >= 12 && y <= 20) {
        if (x >= 7 && x <= 9) return 200; // Ankle pillar
        if (y >= 12 && y <= 14 && x >= 7 && x <= 15) return 220; // Strap
        if (y >= 17 && y <= 19 && x >= 15 && x <= 21) return 220; // Toe strap
      }
      return 0;
    }),
  },
  {
    id: "shirt",
    classId: 6,
    label: "Shirt",
    iconName: "Tag",
    description: "Button-up collared shirt with chest pocket",
    pixels: createPattern((x, y) => {
      if (y >= 6 && y <= 24 && x >= 6 && x <= 21) {
        // Collar notch
        if (y === 6 && x >= 12 && x <= 15) return 0;
        // Central button line
        if (x === 14) return 100;
        return 220;
      }
      // Sleeves
      if (y >= 8 && y <= 15) {
        if ((x >= 3 && x <= 6) || (x >= 21 && x <= 24)) return 200;
      }
      return 0;
    }),
  },
  {
    id: "sneaker",
    classId: 7,
    label: "Sneaker",
    iconName: "Zap",
    description: "Athletic running shoe with thick rubber sole",
    pixels: createPattern((x, y) => {
      // Thick sole (rows 20..24, cols 4..23)
      if (y >= 20 && y <= 24 && x >= 4 && x <= 23) return 255;
      // Shoe upper body
      if (y >= 13 && y <= 19) {
        if (x >= 5 && x <= 21) {
          if (y < 16 && x > 15) return 0; // Slanted ankle dip
          return 210;
        }
      }
      return 0;
    }),
  },
  {
    id: "bag",
    classId: 8,
    label: "Bag",
    iconName: "Briefcase",
    description: "Handbag with top carry handles and square body",
    pixels: createPattern((x, y) => {
      // Handles (rows 4..10)
      if (y >= 4 && y <= 9) {
        if ((x >= 10 && x <= 12) || (x >= 15 && x <= 17)) return 220;
        if (y === 4 && x >= 10 && x <= 17) return 220;
      }
      // Main bag pouch (rows 10..24, cols 6..21)
      if (y >= 10 && y <= 24 && x >= 6 && x <= 21) return 240;
      return 0;
    }),
  },
  {
    id: "ankle_boot",
    classId: 9,
    label: "Ankle boot",
    iconName: "Box",
    description: "High-top leather boot with ankle support collar",
    pixels: createPattern((x, y) => {
      // Base sole (rows 21..25, cols 5..22)
      if (y >= 21 && y <= 25 && x >= 5 && x <= 22) return 250;
      // Ankle neck high top (rows 8..20, cols 6..14)
      if (y >= 8 && y <= 20 && x >= 6 && x <= 14) return 230;
      // Toe box extension (rows 16..20, cols 14..21)
      if (y >= 16 && y <= 20 && x >= 14 && x <= 21) return 230;
      return 0;
    }),
  },
];
