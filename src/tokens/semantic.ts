import { colorPrimitives, spacePrimitives, radiusPrimitives, fontPrimitives } from './primitives';

export const semanticColor = {
  bgPage: colorPrimitives.white,
  bgSurface: colorPrimitives.gray50,
  bgSurfaceHover: colorPrimitives.gray100,
  borderDefault: colorPrimitives.gray300,
  borderStrong: colorPrimitives.gray500,
  textPrimary: colorPrimitives.gray900,
  textSecondary: colorPrimitives.gray600,
  textInverse: colorPrimitives.white,
  actionPrimary: colorPrimitives.blue600,
  actionPrimaryHover: colorPrimitives.blue700,
  actionPrimaryText: colorPrimitives.white,
  danger: colorPrimitives.red500,
  dangerBg: colorPrimitives.red50,
  success: colorPrimitives.green500,
  successBg: colorPrimitives.green50,
  warning: colorPrimitives.amber500,
  warningBg: colorPrimitives.amber50,
} as const;

export const semanticSpace = {
  xs: spacePrimitives.space1,
  sm: spacePrimitives.space2,
  md: spacePrimitives.space4,
  lg: spacePrimitives.space6,
  xl: spacePrimitives.space8,
  '2xl': spacePrimitives.space12,
} as const;

export const semanticRadius = {
  sm: radiusPrimitives.radiusSm,
  md: radiusPrimitives.radiusMd,
  lg: radiusPrimitives.radiusLg,
  full: radiusPrimitives.radiusFull,
} as const;

export const semanticFont = {
  familySans: fontPrimitives.familySans,
  familyMono: fontPrimitives.familyMono,
  sizeXs: fontPrimitives.size12,
  sizeSm: fontPrimitives.size14,
  sizeMd: fontPrimitives.size16,
  sizeLg: fontPrimitives.size18,
  sizeXl: fontPrimitives.size24,
  size2xl: fontPrimitives.size32,
  weightRegular: fontPrimitives.weight400,
  weightMedium: fontPrimitives.weight500,
  weightBold: fontPrimitives.weight700,
  lineHeightTight: fontPrimitives.lineHeight120,
  lineHeightNormal: fontPrimitives.lineHeight150,
} as const;
